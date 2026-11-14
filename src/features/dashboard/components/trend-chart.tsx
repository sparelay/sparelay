"use client";

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

import { TOOLTIP_STYLE, type TrendBucket } from "../lib/charts";

interface Props {
  buckets: TrendBucket[];
}

export function TrendChart({ buckets }: Props) {
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
              dataKey="label"
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              width={30}
              yAxisId="count"
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              width={30}
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
              cursor={{ fill: "var(--muted)", stroke: "var(--border)" }}
            />
            <Legend />
            <Bar
              yAxisId="count"
              dataKey="success"
              name="Success"
              stackId="searches"
              fill="#16a34a"
            />
            <Bar yAxisId="count" dataKey="fail" name="Fail" stackId="searches" fill="#dc2626" />
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
  );
}
