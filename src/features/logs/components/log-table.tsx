"use client";

import { useRouter } from "next/navigation";

import { type LogRow } from "@/features/logs/model/types";
import { ProviderTag } from "@/features/provider/components/provider-tag";
import { toProviderType } from "@/features/provider/lib/to-provider-type";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { fmtTime } from "@/shared/lib/format-date-time";

interface Props {
  rows: LogRow[];
  tz: string;
}

export function LogTable({ rows, tz }: Props) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Query</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Source</TableHead>
          <TableHead className="text-right">Attempts</TableHead>
          <TableHead className="text-right">Results</TableHead>
          <TableHead className="text-right">Duration</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow
            key={r.id}
            className="cursor-pointer"
            onClick={() => router.push(`/logs/${r.id}`)}
          >
            <TableCell className="text-sm whitespace-nowrap">{fmtTime(r.createdAt, tz)}</TableCell>
            <TableCell className="max-w-48">
              <span className="block truncate" title={r.query}>
                {r.query}
              </span>
            </TableCell>
            <TableCell>
              {r.providerName ? (
                <span className="flex items-center gap-1.5">
                  <ProviderTag type={toProviderType(r.providerType)} />
                  {r.providerName}
                </span>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell>{r.source.toUpperCase()}</TableCell>
            <TableCell className="text-right">{r.attempts}</TableCell>
            <TableCell className="text-right">{r.resultsCount}</TableCell>
            <TableCell className="text-right">{r.durationMs}ms</TableCell>
            <TableCell>
              {r.success ? (
                <Badge className="bg-green-600 text-white dark:bg-green-700">OK</Badge>
              ) : (
                <Badge className="bg-red-600 text-white dark:bg-red-700">FAIL</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
