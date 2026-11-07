"use client";

import { useEffect, useState } from "react";

import { getSuccessRate } from "../../actions/get-success-rate";
import type { Range } from "../../model/types";
import { KpiCard } from "./kpi-card";

interface Props {
  range: Range;
}

export function SuccessRateCard({ range }: Props) {
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const v = await getSuccessRate(range);
      setRate(v.success ? v.data : null);
    };
    load();
  }, [range]);

  return <KpiCard label="Success rate" value={rate == null ? "-" : `${rate}%`} />;
}
