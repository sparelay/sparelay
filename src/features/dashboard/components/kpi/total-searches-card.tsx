"use client";

import { useEffect, useState } from "react";

import type { Range } from "@/shared/lib/ranges";

import { getTotalSearches } from "../../actions/get-total-searches";
import { KpiCard } from "./kpi-card";

interface Props {
  range: Range;
}

export function TotalSearchesCard({ range }: Props) {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const v = await getTotalSearches(range);
      setTotal(v.success ? v.data : null);
    };
    load();
  }, [range]);

  return <KpiCard label="Total searches" value={total == null ? "-" : String(total)} />;
}
