"use client";

import { useEffect, useState } from "react";

import { type Point } from "@/features/dashboard/model/types";
import type { Range } from "@/shared/lib/ranges";

import { getPoints } from "../actions/get-points";
import {
  latencyHistogram,
  providerBuckets,
  providerSeries,
  timeBuckets,
  trendBuckets,
} from "../lib/charts";
import { LatencyHistogramChart } from "./latency-histogram-chart";
import { ProviderBreakdownChart } from "./provider-breakdown-chart";
import { TrendChart } from "./trend-chart";

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
      <TrendChart buckets={trendBuckets(buckets)} />
      <ProviderBreakdownChart buckets={providerBuckets(buckets)} series={providerSeries(buckets)} />
      <LatencyHistogramChart bins={latencyHistogram(buckets)} />
    </>
  );
}
