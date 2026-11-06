"use client";

import { useEffect, useState } from "react";

import { getSuccesses } from "../../actions/get-successes";
import type { Range } from "../../model/types";
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
