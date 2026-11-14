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

import { TOOLTIP_STYLE, type TimeBucket } from "@/features/dashboard/lib/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface TrendBucket {
  label: string;
  success: number;
  fail: number;
  avgMs: number | null;
  rate: number | null;
}

function trendBuckets(buckets: TimeBucket[]): TrendBucket[] {
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

export function TrendChart({ buckets }: { buckets: TimeBucket[] }) {
  const data = trendBuckets(buckets);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trend</CardTitle>
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
