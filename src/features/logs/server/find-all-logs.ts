import "server-only";
import { count, desc } from "drizzle-orm";

import { getDb } from "@/shared/db/client";
import { searchLogsTable } from "@/shared/db/schemas";

import type { LogPage } from "../model/types";

export function findAllLogs(limit: number, page: number): LogPage {
  const db = getDb();
  const size = Math.max(1, Math.floor(limit));
  const totalCount = db.select({ c: count() }).from(searchLogsTable).get()?.c ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / size));
  const current = Math.min(Math.max(1, Math.floor(page)), totalPages);
  const rows = db
    .select({
      id: searchLogsTable.id,
      query: searchLogsTable.query,
      providerName: searchLogsTable.providerName,
      providerType: searchLogsTable.providerType,
      source: searchLogsTable.source,
      attempts: searchLogsTable.attempts,
      resultsCount: searchLogsTable.resultsCount,
      durationMs: searchLogsTable.durationMs,
      success: searchLogsTable.success,
      createdAt: searchLogsTable.createdAt,
    })
    .from(searchLogsTable)
    .orderBy(desc(searchLogsTable.createdAt), desc(searchLogsTable.id))
    .limit(size)
    .offset((current - 1) * size)
    .all();
  return { rows, totalCount, page: { current, total: totalPages, size } };
}
