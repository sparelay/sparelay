"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
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

const TOP_PROVIDERS = 4;
const PROVIDER_COLORS = ["var(--chart-1)", "#16a34a", "#f59e0b", "#8b5cf6"];
const OTHER_COLOR = "#94a3b8";

interface ProviderBucket {
  label: string;
  providers: Record<string, number>;
}

function providerSeries(buckets: { label: string; points: Point[] }[]): string[] {
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

function providerBuckets(buckets: { label: string; points: Point[] }[]): ProviderBucket[] {
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

export function ProviderBreakdownChart({
  buckets,
}: {
  buckets: { label: string; points: Point[] }[];
}) {
  const series = providerSeries(buckets);
  const data = providerBuckets(buckets);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Searches by provider</CardTitle>
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
            <Legend />
            {series.map((name, i) => (
              <Bar
                key={name}
                dataKey={`providers.${name}`}
                name={name}
                stackId="providers"
                fill={name === "Other" ? OTHER_COLOR : PROVIDER_COLORS[i % PROVIDER_COLORS.length]}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
