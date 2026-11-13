import "server-only";
import { and, avg, sql } from "drizzle-orm";

import { getDb } from "@/shared/db/client";
import { searchLogsTable } from "@/shared/db/schemas";
import { sinceModifier } from "@/shared/lib/ranges";

export function fetchAvgLatency(hours: number): number {
  const since = sinceModifier(hours);
  const avgMs =
    getDb()
      .select({ v: avg(searchLogsTable.durationMs) })
      .from(searchLogsTable)
      .where(
        and(
          sql`${searchLogsTable.createdAt} >= datetime('now', ${since})`,
          sql`${searchLogsTable.createdAt} <= datetime('now')`,
        ),
      )
      .get()?.v ?? null;
  return avgMs != null ? Math.round(Number(avgMs)) : 0;
}
