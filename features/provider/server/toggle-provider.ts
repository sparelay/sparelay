import "server-only";
import { eq, sql } from "drizzle-orm";

import { getDb } from "@/shared/db/client";
import { providersTable } from "@/shared/db/schemas";
import type { ProviderRow } from "@/shared/db/types";

export function toggleProviderById(id: string): ProviderRow | null {
  const db = getDb();
  const current = db.select().from(providersTable).where(eq(providersTable.id, id)).get();
  if (!current) return null;
  db.update(providersTable)
    .set({
      enabled: !current.enabled,
      updatedAt: sql`(datetime('now'))`,
    })
    .where(eq(providersTable.id, id))
    .run();
  return db.select().from(providersTable).where(eq(providersTable.id, id)).get() ?? null;
}
