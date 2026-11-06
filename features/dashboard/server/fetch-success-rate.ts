import "server-only";
import { and, count, eq, sql } from "drizzle-orm";

import { getDb } from "@/shared/db/client";
import { searchLogsTable } from "@/shared/db/schemas";

import { sinceModifier } from "../lib/ranges";

export function fetchSuccessRate(hours: number): number {
  const since = sinceModifier(hours);
  const db = getDb();
  const within = and(
    sql`${searchLogsTable.createdAt} >= datetime('now', ${since})`,
    sql`${searchLogsTable.createdAt} <= datetime('now')`,
  );
  const total = db.select({ c: count() }).from(searchLogsTable).where(within).get()?.c ?? 0;
  const success =
    db
      .select({ c: count() })
      .from(searchLogsTable)
      .where(and(within, eq(searchLogsTable.success, true)))
      .get()?.c ?? 0;
  return total > 0 ? Math.round((success / total) * 1000) / 10 : 0;
}
