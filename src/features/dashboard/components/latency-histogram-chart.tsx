"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { Point } from "@/features/dashboard/model/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

const TOOLTIP_STYLE = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  color: "var(--popover-foreground)",
};

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

function latencyHistogram(buckets: { label: string; points: Point[] }[]): LatencyBin[] {
  const points = buckets.flatMap(({ points: pts }) => pts);
  const bounds = [0, ...LATENCY_BINS.map((bin) => bin.max)];
  return LATENCY_BINS.map((bin, i) => ({
    label: bin.label,
    count: points.filter((p) => p.d >= bounds[i] && p.d < bin.max).length,
  }));
}

export function LatencyHistogramChart({
  buckets,
}: {
  buckets: { label: string; points: Point[] }[];
}) {
  const data = latencyHistogram(buckets);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latency distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              width={30}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={{ stroke: "var(--border)" }}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              itemStyle={{ color: "var(--popover-foreground)" }}
              cursor={{ fill: "var(--muted)", stroke: "var(--border)" }}
            />
            <Bar dataKey="count" name="Searches" fill="var(--chart-1)" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
