import "server-only";
import { eq, sql } from "drizzle-orm";

import { getDb } from "@/shared/db/client";
import { providersTable } from "@/shared/db/schemas";

export function startProviderCooldown(id: string, seconds: number): void {
  if (!Number.isFinite(seconds) || seconds <= 0) return;
  try {
    getDb()
      .update(providersTable)
      .set({ cooldownUntil: sql`datetime('now', ${`+${Math.floor(seconds)} seconds`})` })
      .where(eq(providersTable.id, id))
      .run();
  } catch {}
}
