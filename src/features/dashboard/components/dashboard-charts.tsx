"use client";

import { useEffect, useState } from "react";

import { type Point } from "@/features/dashboard/model/types";
import { rangeHours, type Range } from "@/shared/lib/ranges";

import { getPoints } from "../actions/get-points";
import { LatencyHistogramChart } from "./latency-histogram-chart";
import { ProviderBreakdownChart } from "./provider-breakdown-chart";
import { TrendChart } from "./trend-chart";

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

export interface TimeBucket {
  label: string;
  points: Point[];
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
    Date.UTC(
      get("year"),
      get("month") - 1,
      get("day"),
      get("hour"),
      get("minute"),
      get("second"),
      d.getMilliseconds(),
    ) - d.getTime()
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
    const bucket = map.get(start);
    if (!bucket) continue;
    bucket.push(pt);
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([start, pts]) => ({ label: formatBucketLabel(start, tz, daily), points: pts }));
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

  const buckets = timeBuckets(points, tz, range);

  return (
    <>
      <TrendChart buckets={buckets} />
      <ProviderBreakdownChart buckets={buckets} />
      <LatencyHistogramChart buckets={buckets} />
    </>
  );
}
