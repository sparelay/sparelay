import "server-only";
import { asc, eq, sql } from "drizzle-orm";

import { getDb } from "@/shared/db/client";
import { providersTable } from "@/shared/db/schemas";
import type { ProviderRow } from "@/shared/db/types";

export function reorderProvidersByIds(ids: string[]): ProviderRow[] {
  const db = getDb();
  db.transaction((tx) => {
    ids.forEach((id, i) => {
      tx.update(providersTable)
        .set({ order: i, updatedAt: sql`(datetime('now'))` })
        .where(eq(providersTable.id, id))
        .run();
    });
  });
  return db.select().from(providersTable).orderBy(asc(providersTable.order)).all();
}
