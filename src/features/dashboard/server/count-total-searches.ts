import "server-only";
import { count, sql } from "drizzle-orm";

import { getDb } from "@/shared/db/client";
import { searchLogsTable } from "@/shared/db/schemas";

import { sinceModifier } from "../lib/ranges";

export function countTotalSearches(hours: number): number {
  const since = sinceModifier(hours);
  return (
    getDb()
      .select({ c: count() })
      .from(searchLogsTable)
      .where(
        sql`${searchLogsTable.createdAt} >= datetime('now', ${since}) AND ${searchLogsTable.createdAt} <= datetime('now')`,
      )
      .get()?.c ?? 0
  );
}
