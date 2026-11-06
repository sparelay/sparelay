"use client";

import { useEffect, useState } from "react";

import { ProviderTag } from "@/features/provider/components/provider-tag";
import { toProviderType } from "@/features/provider/lib/to-provider-type";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { fmtTime } from "@/shared/lib/format-date-time";

import { getProviderStats } from "../actions/get-provider-stats";
import type { Range } from "../model/types";
import type { ProviderStat } from "../model/types";

interface Props {
  range: Range;
  tz: string;
}

export function ProviderTable({ range, tz }: Props) {
  const [providers, setProviders] = useState<ProviderStat[]>([]);

  useEffect(() => {
    getProviderStats(range).then((p) => {
      if (!p.success) {
        return;
      }
      setProviders(p.data);
    });
  }, [range]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>By provider</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Calls</TableHead>
              <TableHead className="text-right">Success</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead className="text-right">Avg</TableHead>
              <TableHead>Last used</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">
                  {p.name}
                  {!p.enabled && (
                    <Badge variant="secondary" className="ml-2">
                      Disabled
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <ProviderTag type={toProviderType(p.type)} />
                </TableCell>
                <TableCell className="text-right">{p.calls}</TableCell>
                <TableCell className="text-right">{p.success}</TableCell>
                <TableCell className="text-right">{p.successRate}%</TableCell>
                <TableCell className="text-right">{p.avgMs}ms</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {p.lastUsed ? fmtTime(p.lastUsed, tz) : "-"}
                </TableCell>
              </TableRow>
            ))}
            {providers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No providers registered
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
