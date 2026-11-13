"use client";

import { useRouter } from "next/navigation";

import { FailBadge } from "@/features/logs/components/fail-badge";
import { OkBadge } from "@/features/logs/components/ok-badge";
import { type LogRow } from "@/features/logs/model/types";
import { ProviderTag } from "@/features/provider/components/provider-tag";
import { toProviderType } from "@/features/provider/lib/to-provider-type";
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
    <>
      <div className="flex flex-col gap-2 sm:hidden">
        {rows.map((r) => (
          <div
            key={r.id}
            className="cursor-pointer rounded-lg border p-3"
            onClick={() => router.push(`/logs/${r.id}`)}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">{fmtTime(r.createdAt, tz)}</span>
              {r.success ? <OkBadge /> : <FailBadge />}
            </div>
            <span className="mt-1 line-clamp-2 text-sm">{r.query}</span>
            <div className="mt-2 flex items-center justify-between gap-2">
              {r.providerName ? (
                <span className="flex items-center gap-1.5 text-sm">
                  <ProviderTag type={toProviderType(r.providerType)} />
                  {r.providerName}
                </span>
              ) : (
                <span className="text-sm">-</span>
              )}
              <span className="text-xs text-muted-foreground">{r.durationMs}ms</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {`${r.source.toUpperCase()} · ${r.attempts} attempts · ${r.resultsCount} results`}
            </div>
          </div>
        ))}
      </div>
      <div className="hidden sm:block">
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
                <TableCell className="text-sm whitespace-nowrap">
                  {fmtTime(r.createdAt, tz)}
                </TableCell>
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
                <TableCell>{r.success ? <OkBadge /> : <FailBadge />}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
