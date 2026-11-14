import { rangeHours, type Range } from "@/shared/lib/ranges";

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

export const TOOLTIP_STYLE = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  color: "var(--popover-foreground)",
};

const TOP_PROVIDERS = 4;

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

export function timeBuckets(
  points: Point[],
  tz: string,
  range: Range,
  now: number = Date.now(),
): TimeBucket[] {
  const bucketMs = (BUCKET_MINUTES[range] ?? 360) * 60_000;
  const daily = bucketMs >= 24 * 3600_000;
  const windowMs = rangeHours(range).hours * 3600_000;
  const count = Math.max(1, Math.round(windowMs / bucketMs));
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
    const bucket = map.get(start);
    if (!bucket) continue;
    bucket.push(pt);
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([start, pts]) => ({ label: formatBucketLabel(start, tz, daily), points: pts }));
}

export interface TrendBucket {
  label: string;
  success: number;
  fail: number;
  avgMs: number | null;
  rate: number | null;
}

export function trendBuckets(buckets: TimeBucket[]): TrendBucket[] {
  return buckets.map(({ label, points: pts }) => {
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

export interface ProviderBucket {
  label: string;
  providers: Record<string, number>;
}

export function providerSeries(buckets: TimeBucket[]): string[] {
  const counts = new Map<string, number>();
  for (const { points: pts } of buckets) {
    for (const pt of pts) {
      const name = pt.provider ?? "Unknown";
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  const top = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, TOP_PROVIDERS)
    .map(([name]) => name);
  if (counts.size > top.length) top.push("Other");
  return top;
}

export function providerBuckets(buckets: TimeBucket[]): ProviderBucket[] {
  const series = providerSeries(buckets);
  const top = new Set(series.filter((name) => name !== "Other"));
  return buckets.map(({ label, points: pts }) => {
    const providers: Record<string, number> = {};
    for (const name of series) providers[name] = 0;
    for (const pt of pts) {
      const name = pt.provider ?? "Unknown";
      const key = top.has(name) ? name : "Other";
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

export interface LatencyBin {
  label: string;
  count: number;
}

export function latencyHistogram(buckets: TimeBucket[]): LatencyBin[] {
  const points = buckets.flatMap(({ points: pts }) => pts);
  const bounds = [0, ...LATENCY_BINS.map((bin) => bin.max)];
  return LATENCY_BINS.map((bin, i) => ({
    label: bin.label,
    count: points.filter((p) => p.d >= bounds[i] && p.d < bin.max).length,
  }));
}
