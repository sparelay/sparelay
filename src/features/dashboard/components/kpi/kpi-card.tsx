"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface Props {
  label: string;
  value: string;
}

export function KpiCard({ label, value }: Props) {
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
