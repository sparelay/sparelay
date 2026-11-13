"use client";

import { useEffect, useState } from "react";

import type { Range } from "@/shared/lib/ranges";

import { getSuccesses } from "../../actions/get-successes";
import { KpiCard } from "./kpi-card";

interface Props {
  range: Range;
}

export function SuccessesCard({ range }: Props) {
  const [success, setSuccess] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const v = await getSuccesses(range);
      setSuccess(v.success ? v.data : null);
    };
    load();
  }, [range]);

  return <KpiCard label="Successes" value={success == null ? "-" : String(success)} />;
}
