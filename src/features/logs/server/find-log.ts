import "server-only";
import { eq } from "drizzle-orm";

import { getDb } from "@/shared/db/client";
import { searchLogsTable } from "@/shared/db/schemas";

import type { LogDetail } from "../model/types";

export function findLog(id: string): LogDetail | null {
  const row = getDb()
    .select({
      id: searchLogsTable.id,
      query: searchLogsTable.query,
      providerName: searchLogsTable.providerName,
      providerType: searchLogsTable.providerType,
      attempts: searchLogsTable.attempts,
      resultsCount: searchLogsTable.resultsCount,
      durationMs: searchLogsTable.durationMs,
      success: searchLogsTable.success,
      source: searchLogsTable.source,
      createdAt: searchLogsTable.createdAt,
      resultsJson: searchLogsTable.resultsJson,
    })
    .from(searchLogsTable)
    .where(eq(searchLogsTable.id, id))
    .get();
  return row ?? null;
}
