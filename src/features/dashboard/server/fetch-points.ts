import "server-only";
import { and, asc, sql } from "drizzle-orm";

import { getDb } from "@/shared/db/client";
import { searchLogsTable } from "@/shared/db/schemas";
import { sinceModifier } from "@/shared/lib/ranges";

import type { Point } from "../model/types";

export function fetchPoints(hours: number): { points: Point[]; capped: boolean } {
  const MAX_POINTS = 20000;
  const rows = getDb()
    .select({
      t: searchLogsTable.createdAt,
      d: searchLogsTable.durationMs,
      success: searchLogsTable.success,
      provider: searchLogsTable.providerName,
    })
    .from(searchLogsTable)
    .where(
      and(
        sql`${searchLogsTable.createdAt} >= datetime('now', ${sinceModifier(hours)})`,
        sql`${searchLogsTable.createdAt} <= datetime('now')`,
      ),
    )
    .orderBy(asc(searchLogsTable.createdAt), asc(searchLogsTable.id))
    .limit(MAX_POINTS + 1)
    .all();
  return { points: rows.slice(0, MAX_POINTS), capped: rows.length > MAX_POINTS };
}
