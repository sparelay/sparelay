import "server-only";
import { and, count, sql } from "drizzle-orm";

import { getDb } from "@/shared/db/client";
import { searchLogsTable } from "@/shared/db/schemas";
import { sinceModifier } from "@/shared/lib/ranges";

export function countFallbacks(hours: number): number {
  const since = sinceModifier(hours);
  return (
    getDb()
      .select({ c: count() })
      .from(searchLogsTable)
      .where(
        and(
          sql`${searchLogsTable.createdAt} >= datetime('now', ${since})`,
          sql`${searchLogsTable.createdAt} <= datetime('now')`,
          sql`${searchLogsTable.attempts} > 1`,
        ),
      )
      .get()?.c ?? 0
  );
}
