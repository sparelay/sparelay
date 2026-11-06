import "server-only";
import { eq, sql } from "drizzle-orm";

import { getDb } from "@/shared/db/client";
import { providersTable } from "@/shared/db/schemas";
import type { ProviderRow } from "@/shared/db/types";

interface UpdateProviderData {
  name: string;
  baseUrl: string;
  enabled: boolean;
  timeoutSec: number;
  cooldown: number;
  fallbackOnEmpty: boolean;
  extra: Record<string, string>;
  apiKey?: string;
}

export function updateProviderById(id: string, data: UpdateProviderData): ProviderRow | null {
  const db = getDb();
  const { apiKey, ...rest } = data;
  const sets = apiKey ? { ...rest, apiKey } : { ...rest };
  db.update(providersTable)
    .set({ ...sets, cooldownUntil: null, updatedAt: sql`(datetime('now'))` })
    .where(eq(providersTable.id, id))
    .run();
  return db.select().from(providersTable).where(eq(providersTable.id, id)).get() ?? null;
}
