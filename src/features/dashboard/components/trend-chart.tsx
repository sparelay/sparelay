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

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import type { Range } from "@/shared/lib/ranges";
import { rangeHours } from "@/shared/lib/ranges";

import { getPoints } from "../actions/get-points";
import type { Point } from "../model/types";

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

interface Bucket {
  day: string;
  count: number;
  avgMs: number | null;
}

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

function bucketize(points: Point[], tz: string, range: Range): Bucket[] {
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
  const map = new Map<number, { count: number; total: number }>();
  for (let s = firstStart; s <= endStart; s += bucketMs) {
    map.set(s, { count: 0, total: 0 });
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
    const b = map.get(start) ?? { count: 0, total: 0 };
    b.count += 1;
    b.total += pt.d;
    map.set(start, b);
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([start, b]) => ({
      day: formatBucketLabel(start, tz, daily),
      count: b.count,
      avgMs: b.count > 0 ? Math.round(b.total / b.count) : null,
    }));
}

interface Props {
  range: Range;
  tz: string;
}

export function TrendChart({ range, tz }: Props) {
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    getPoints(range).then((pts) => {
      if (!pts.success) {
        return;
      }
      setPoints(pts.data.points ?? []);
    });
  }, [range]);

  const buckets: Bucket[] = bucketize(points, tz, range);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={buckets}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={{ stroke: "var(--border)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                color: "var(--popover-foreground)",
              }}
              labelStyle={{ color: "var(--popover-foreground)" }}
              itemStyle={{ color: "var(--popover-foreground)" }}
              cursor={{ fill: "var(--muted)", stroke: "var(--border)" }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="count" name="Searches" fill="var(--chart-1)" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgMs"
              name="Avg ms"
              dot={false}
              connectNulls
              stroke="var(--chart-2)"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
