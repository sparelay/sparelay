import "server-only";
import { eq } from "drizzle-orm";

import { getDb } from "@/shared/db/client";
import { providersTable } from "@/shared/db/schemas";
import type { ProviderRow } from "@/shared/db/types";

export function findProvider(id: string): ProviderRow | null {
  return getDb().select().from(providersTable).where(eq(providersTable.id, id)).get() ?? null;
}
