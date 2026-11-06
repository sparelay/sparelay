"use client";

import { useEffect, useState } from "react";

import { getTotalSearches } from "../../actions/get-total-searches";
import type { Range } from "../../model/types";
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
