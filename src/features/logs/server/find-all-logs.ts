import "server-only";
import { and, count, desc, eq, sql, type SQL } from "drizzle-orm";

import { getDb } from "@/shared/db/client";
import { searchLogsTable } from "@/shared/db/schemas";

import type { LogFilters } from "../model/filters";
import type { LogPage } from "../model/types";

function filterCondition(filters: LogFilters): SQL | undefined {
  const conditions: SQL[] = [];
  if (filters.q) {
    const pattern = `%${filters.q.replace(/[\\%_]/g, "\\$&")}%`;
    conditions.push(sql`${searchLogsTable.query} LIKE ${pattern} ESCAPE ${"\\"}`);
  }
  if (filters.provider) {
    conditions.push(eq(searchLogsTable.providerType, filters.provider));
  }
  if (filters.status) {
    conditions.push(eq(searchLogsTable.success, filters.status === "ok"));
  }
  if (conditions.length === 0) {
    return undefined;
  }
  return and(...conditions);
}

export function findAllLogs(limit: number, page: number, filters: LogFilters = {}): LogPage {
  const db = getDb();
  const size = Math.max(1, Math.floor(limit));
  const where = filterCondition(filters);
  const totalCount = db.select({ c: count() }).from(searchLogsTable).where(where).get()?.c ?? 0;
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
    .where(where)
    .orderBy(desc(searchLogsTable.createdAt), desc(searchLogsTable.id))
    .limit(size)
    .offset((current - 1) * size)
    .all();
  return { rows, totalCount, page: { current, total: totalPages, size } };
}
