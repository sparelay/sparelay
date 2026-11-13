"use client";

import { useEffect, useState } from "react";

import { ProviderTag } from "@/features/provider/components/provider-tag";
import { toProviderType } from "@/features/provider/lib/to-provider-type";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Switch } from "@/shared/components/ui/switch";
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
  const [showUnused, setShowUnused] = useState(false);

  useEffect(() => {
    getProviderStats(range).then((p) => {
      if (!p.success) {
        return;
      }
      setProviders(p.data);
    });
  }, [range]);

  const used = providers.filter((p) => p.calls >= 1);
  const shown = showUnused ? providers : used;

  return (
    <Card>
      <CardHeader>
        <CardTitle>By provider</CardTitle>
        <CardAction>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Switch
              checked={showUnused}
              onCheckedChange={setShowUnused}
              aria-label="Show unused providers"
            />
            Show unused
          </label>
        </CardAction>
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
            {shown.map((p) => (
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
            {shown.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  {providers.length === 0 ? "No providers registered" : "No calls in this range"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
