import "server-only";
import { asc, eq } from "drizzle-orm";

import { getDb } from "@/shared/db/client";
import { providersTable } from "@/shared/db/schemas";
import type { ProviderRow } from "@/shared/db/types";

export function findAllProviders(): ProviderRow[] {
  return getDb().select().from(providersTable).orderBy(asc(providersTable.order)).all();
}

export function findAllEnabledProviders(): ProviderRow[] {
  return getDb()
    .select()
    .from(providersTable)
    .where(eq(providersTable.enabled, true))
    .orderBy(asc(providersTable.order))
    .all();
}
