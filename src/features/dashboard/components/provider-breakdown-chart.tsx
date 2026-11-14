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

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

import { TOOLTIP_STYLE, type ProviderBucket } from "../lib/charts";

const PROVIDER_COLORS = ["var(--chart-1)", "#16a34a", "#f59e0b", "#8b5cf6"];
const OTHER_COLOR = "#94a3b8";

interface Props {
  buckets: ProviderBucket[];
  series: string[];
}

export function ProviderBreakdownChart({ buckets, series }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Searches by provider</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={buckets}>
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
