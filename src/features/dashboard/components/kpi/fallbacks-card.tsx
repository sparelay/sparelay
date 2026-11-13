"use client";

import { useEffect, useState } from "react";

import type { Range } from "@/shared/lib/ranges";

import { getFallbacks } from "../../actions/get-fallbacks";
import { KpiCard } from "./kpi-card";

interface Props {
  range: Range;
}

export function FallbacksCard({ range }: Props) {
  const [fallbacks, setFallbacks] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const v = await getFallbacks(range);
      setFallbacks(v.success ? v.data : null);
    };
    load();
  }, [range]);

  return <KpiCard label="Fallbacks" value={fallbacks == null ? "-" : String(fallbacks)} />;
}
