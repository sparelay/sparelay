import "server-only";
import { and, asc, sql } from "drizzle-orm";

import { getDb } from "@/shared/db/client";
import { searchLogsTable } from "@/shared/db/schemas";
import { sinceModifier } from "@/shared/lib/ranges";

import { percentile } from "../lib/ranges";

export function fetchP95Latency(hours: number): number {
  const since = sinceModifier(hours);
  const durations = getDb()
    .select({ d: searchLogsTable.durationMs })
    .from(searchLogsTable)
    .where(
      and(
        sql`${searchLogsTable.createdAt} >= datetime('now', ${since})`,
        sql`${searchLogsTable.createdAt} <= datetime('now')`,
      ),
    )
    .orderBy(asc(searchLogsTable.durationMs))
    .all()
    .map((x) => x.d);
  return percentile(durations, 95);
}
