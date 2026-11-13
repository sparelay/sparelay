"use client";

import { useEffect, useState } from "react";

import type { Range } from "@/shared/lib/ranges";

import { getAvgLatency } from "../../actions/get-avg-latency";
import { KpiCard } from "./kpi-card";

interface Props {
  range: Range;
}

export function AvgLatencyCard({ range }: Props) {
  const [avgMs, setAvgMs] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const v = await getAvgLatency(range);
      setAvgMs(v.success ? v.data : null);
    };
    load();
  }, [range]);

  return <KpiCard label="Avg latency" value={avgMs == null ? "-" : `${avgMs}ms`} />;
}
