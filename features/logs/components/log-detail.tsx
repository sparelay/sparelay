"use client";

import { ProviderTag } from "@/features/provider/components/provider-tag";
import { toProviderType } from "@/features/provider/lib/to-provider-type";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { fmtTime } from "@/shared/lib/format-date-time";

import type { LogDetail as LogDetailData } from "../model/types";

function prettyJson(raw: unknown): string {
  if (raw == null) return "[]";
  if (typeof raw === "string") {
    if (!raw) return "[]";
    try {
      return JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      return raw;
    }
  }
  try {
    return JSON.stringify(raw, null, 2);
  } catch {
    return "[]";
  }
}

interface Props {
  log: LogDetailData;
  tz: string;
}

export function LogDetail({ log, tz }: Props) {
  const fields: [string, React.ReactNode][] = [
    ["Time", fmtTime(log.createdAt, tz)],
    ["Query", log.query],
    [
      "Provider",
      log.providerName ? (
        <span className="flex items-center gap-1.5">
          <ProviderTag type={toProviderType(log.providerType)} />
          {log.providerName}
        </span>
      ) : (
        "-"
      ),
    ],
    ["Source", log.source.toUpperCase()],
    ["Attempts", String(log.attempts)],
    ["Results", String(log.resultsCount)],
    ["Duration", `${log.durationMs}ms`],
    [
      "Status",
      log.success ? (
        <Badge className="bg-green-600 text-white dark:bg-green-700">OK</Badge>
      ) : (
        <Badge className="bg-red-600 text-white dark:bg-red-700">FAIL</Badge>
      ),
    ],
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {fields.map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">{k}</span>
              <span className="text-sm font-medium break-all">{v}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Results JSON</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
            {prettyJson(log.resultsJson)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
