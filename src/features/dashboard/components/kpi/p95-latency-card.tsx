"use client";

import { useEffect, useState } from "react";

import type { Range } from "@/shared/lib/ranges";

import { getP95Latency } from "../../actions/get-p95-latency";
import { KpiCard } from "./kpi-card";

interface Props {
  range: Range;
}

export function P95LatencyCard({ range }: Props) {
  const [p95Ms, setP95Ms] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const v = await getP95Latency(range);
      setP95Ms(v.success ? v.data : null);
    };
    load();
  }, [range]);

  return <KpiCard label="p95 latency" value={p95Ms == null ? "-" : `${p95Ms}ms`} />;
}
