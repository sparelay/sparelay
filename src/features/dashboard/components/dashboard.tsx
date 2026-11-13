"use client";

import { useState } from "react";

import type { Range } from "@/shared/lib/ranges";

import { AvgLatencyCard } from "./kpi/avg-latency-card";
import { FallbacksCard } from "./kpi/fallbacks-card";
import { P95LatencyCard } from "./kpi/p95-latency-card";
import { SuccessRateCard } from "./kpi/success-rate-card";
import { SuccessesCard } from "./kpi/successes-card";
import { TotalSearchesCard } from "./kpi/total-searches-card";
import { ProviderTable } from "./provider-table";
import { RangeTabs } from "./range-tabs";
import { TrendChart } from "./trend-chart";

interface Props {
  tz: string;
}

export function Dashboard({ tz }: Props) {
  const [range, setRange] = useState<Range>("7d");

  return (
    <div className="flex flex-col gap-6">
      <RangeTabs range={range} onChange={setRange} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <TotalSearchesCard range={range} />
        <SuccessesCard range={range} />
        <SuccessRateCard range={range} />
        <AvgLatencyCard range={range} />
        <P95LatencyCard range={range} />
        <FallbacksCard range={range} />
      </div>
      <ProviderTable range={range} tz={tz} />
      <TrendChart range={range} tz={tz} />
    </div>
  );
}
