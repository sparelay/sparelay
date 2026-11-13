"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { type Point } from "@/features/dashboard/model/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import type { Range } from "@/shared/lib/ranges";
import { rangeHours } from "@/shared/lib/ranges";

import { getPoints } from "../actions/get-points";

const BUCKET_MINUTES: Record<string, number> = {
  "1h": 1,
  "6h": 10,
  "12h": 30,
  "1d": 60,
  "3d": 180,
  "7d": 360,
  "14d": 720,
  "30d": 1440,
};

const SUCCESS_COLOR = "#16a34a";
const FAIL_COLOR = "#dc2626";
const PROVIDER_COLORS = ["var(--chart-1)", "#16a34a", "#f59e0b", "#8b5cf6"];
const OTHER_COLOR = "#94a3b8";

const TOOLTIP_STYLE = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  color: "var(--popover-foreground)",
};

function tzOffsetMs(d: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(d);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return (
    Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second")) -
    d.getTime()
  );
}

function formatBucketLabel(start: number, tz: string, daily: boolean): string {
  try {
    return new Intl.DateTimeFormat(
      "en-US",
      daily
        ? { timeZone: tz, month: "2-digit", day: "2-digit" }
        : {
            timeZone: tz,
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
          },
    ).format(new Date(start));
  } catch {
    return new Date(start).toISOString();
  }
}

interface TimeBucket {
  label: string;
  points: Point[];
}

function timeBuckets(points: Point[], tz: string, range: Range): TimeBucket[] {
  const bucketMs = (BUCKET_MINUTES[range] ?? 360) * 60_000;
  const daily = bucketMs >= 24 * 3600_000;
  const windowMs = rangeHours(range).hours * 3600_000;
  const count = Math.max(1, Math.round(windowMs / bucketMs));
  const now = Date.now();
  let offsetNow = 0;
  try {
    offsetNow = tzOffsetMs(new Date(now), tz);
  } catch {}
  const endStart = Math.floor((now + offsetNow) / bucketMs) * bucketMs - offsetNow;
  const firstStart = endStart - (count - 1) * bucketMs;
  const map = new Map<number, Point[]>();
  for (let s = firstStart; s <= endStart; s += bucketMs) {
    map.set(s, []);
  }
  for (const pt of points) {
    const d = new Date(pt.t.replace(" ", "T") + "Z");
    if (Number.isNaN(d.getTime())) continue;
    let offset = 0;
    try {
      offset = tzOffsetMs(d, tz);
    } catch {
      continue;
    }
    const start = Math.floor((d.getTime() + offset) / bucketMs) * bucketMs - offset;
    const bucket = map.get(start) ?? [];
    bucket.push(pt);
    map.set(start, bucket);
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([start, pts]) => ({ label: formatBucketLabel(start, tz, daily), points: pts }));
}

interface TrendBucket {
  label: string;
  success: number;
  fail: number;
  avgMs: number | null;
  rate: number | null;
}

function trendBuckets(points: Point[], tz: string, range: Range): TrendBucket[] {
  return timeBuckets(points, tz, range).map(({ label, points: pts }) => {
    const success = pts.filter((p) => p.success).length;
    const fail = pts.length - success;
    const total = pts.reduce((sum, p) => sum + p.d, 0);
    return {
      label,
      success,
      fail,
      avgMs: pts.length > 0 ? Math.round(total / pts.length) : null,
      rate: pts.length > 0 ? Math.round((success / pts.length) * 1000) / 10 : null,
    };
  });
}

interface ProviderBucket {
  label: string;
  providers: Record<string, number>;
}

const TOP_PROVIDERS = 4;

function providerBreakdown(points: Point[], tz: string, range: Range): ProviderBucket[] {
  const counts = new Map<string, number>();
  for (const pt of points) {
    const name = pt.provider ?? "Unknown";
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  const top = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_PROVIDERS)
    .map(([name]) => name);
  const inTop = new Set(top);
  const withOther = [...top, top.length < counts.size ? "Other" : null].filter(
    (name): name is string => name !== null,
  );
  return timeBuckets(points, tz, range).map(({ label, points: pts }) => {
    const providers: Record<string, number> = {};
    for (const name of withOther) providers[name] = 0;
    for (const pt of pts) {
      const name = pt.provider ?? "Unknown";
      const key = inTop.has(name) ? name : "Other";
      providers[key] += 1;
    }
    return { label, providers };
  });
}

const LATENCY_BINS = [
  { max: 200, label: "<200ms" },
  { max: 400, label: "200-400" },
  { max: 600, label: "400-600" },
  { max: 800, label: "600-800" },
  { max: 1000, label: "800ms-1s" },
  { max: 1500, label: "1-1.5s" },
  { max: 2000, label: "1.5-2s" },
  { max: Infinity, label: "2s+" },
];

interface LatencyBin {
  label: string;
  count: number;
}

function latencyHistogram(points: Point[]): LatencyBin[] {
  const bounds = [0, ...LATENCY_BINS.map((bin) => bin.max)];
  return LATENCY_BINS.map((bin, i) => ({
    label: bin.label,
    count: points.filter((p) => p.d >= bounds[i] && p.d < bin.max).length,
  }));
}

interface Props {
  range: Range;
  tz: string;
}

export function DashboardCharts({ range, tz }: Props) {
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    getPoints(range).then((result) => {
      if (!result.success) {
        return;
      }
      setPoints(result.data.points ?? []);
    });
  }, [range]);

  const trend = trendBuckets(points, tz, range);
  const byProvider = providerBreakdown(points, tz, range);
  const providerNames = byProvider.length > 0 ? Object.keys(byProvider[0].providers) : [];
  const histogram = latencyHistogram(points);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                yAxisId="count"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                yAxisId="ms"
                orientation="right"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={{ stroke: "var(--border)" }}
              />
              <YAxis yAxisId="rate" orientation="right" hide domain={[0, 100]} />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                itemStyle={{ color: "var(--popover-foreground)" }}
              />
              <Legend />
              <Bar
                yAxisId="count"
                dataKey="success"
                name="Success"
                stackId="searches"
                fill={SUCCESS_COLOR}
              />
              <Bar
                yAxisId="count"
                dataKey="fail"
                name="Fail"
                stackId="searches"
                fill={FAIL_COLOR}
              />
              <Line
                yAxisId="ms"
                type="monotone"
                dataKey="avgMs"
                name="Avg ms"
                dot={false}
                connectNulls
                stroke="var(--chart-2)"
                strokeWidth={2}
              />
              <Line
                yAxisId="rate"
                type="monotone"
                dataKey="rate"
                name="Success rate %"
                dot={false}
                connectNulls
                stroke="var(--chart-1)"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Searches by provider</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={byProvider}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={{ stroke: "var(--border)" }}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                itemStyle={{ color: "var(--popover-foreground)" }}
              />
              <Legend />
              {providerNames.map((name, i) => (
                <Bar
                  key={name}
                  dataKey={`providers.${name}`}
                  name={name}
                  stackId="providers"
                  fill={PROVIDER_COLORS[i % PROVIDER_COLORS.length] ?? OTHER_COLOR}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Latency distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={histogram}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={{ stroke: "var(--border)" }}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                itemStyle={{ color: "var(--popover-foreground)" }}
              />
              <Bar dataKey="count" name="Searches" fill="var(--chart-1)" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}
