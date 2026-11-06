import "server-only";
import { asc, eq } from "drizzle-orm";

import { getDb } from "@/shared/db/client";
import { providersTable } from "@/shared/db/schemas";

export function deleteProviderById(id: string): void {
  const db = getDb();
  db.transaction((tx) => {
    tx.delete(providersTable).where(eq(providersTable.id, id)).run();
    const rows = tx
      .select({ id: providersTable.id })
      .from(providersTable)
      .orderBy(asc(providersTable.order))
      .all();
    rows.forEach((r, i) => {
      tx.update(providersTable).set({ order: i }).where(eq(providersTable.id, r.id)).run();
    });
  });
}
