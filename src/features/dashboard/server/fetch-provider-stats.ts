import "server-only";
import { and, asc, avg, count, max, sql } from "drizzle-orm";

import { getDb } from "@/shared/db/client";
import { providersTable, searchLogsTable } from "@/shared/db/schemas";
import { sinceModifier } from "@/shared/lib/ranges";

import type { ProviderStat } from "../model/types";

export function fetchProviderStats(hours: number): ProviderStat[] {
  const since = sinceModifier(hours);
  const db = getDb();
  const allProviders = db.select().from(providersTable).orderBy(asc(providersTable.order)).all();
  const agg = db
    .select({
      name: searchLogsTable.providerName,
      calls: count(),
      success: sql<number>`sum(${searchLogsTable.success})`,
      avgMs: avg(searchLogsTable.durationMs),
      lastUsed: max(searchLogsTable.createdAt),
    })
    .from(searchLogsTable)
    .where(
      and(
        sql`${searchLogsTable.createdAt} >= datetime('now', ${since})`,
        sql`${searchLogsTable.createdAt} <= datetime('now')`,
      ),
    )
    .groupBy(searchLogsTable.providerName)
    .all();
  const byName = new Map(agg.map((a) => [a.name, a]));
  return allProviders.map((p) => {
    const a = byName.get(p.name);
    const calls = a?.calls ?? 0;
    const success = Number(a?.success ?? 0);
    return {
      id: p.id,
      name: p.name,
      type: p.type,
      enabled: p.enabled,
      calls,
      success,
      fail: calls - success,
      successRate: calls > 0 ? Math.round((success / calls) * 1000) / 10 : 0,
      avgMs: a?.avgMs != null ? Math.round(Number(a.avgMs)) : 0,
      lastUsed: a?.lastUsed ?? null,
    };
  });
}
