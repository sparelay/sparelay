import "server-only";
import { eq, max } from "drizzle-orm";

import { getDb } from "@/shared/db/client";
import { providersTable } from "@/shared/db/schemas";
import type { ProviderRow } from "@/shared/db/types";

import type { ProviderType } from "../model/provider";

interface CreateProviderData {
  type: ProviderType;
  name: string;
  baseUrl: string;
  apiKey?: string;
  enabled: boolean;
  timeoutSec: number;
  cooldown: number;
  fallbackOnEmpty: boolean;
  extra: Record<string, string>;
}

export function createProvider(data: CreateProviderData): ProviderRow | null {
  const db = getDb();
  const nextOrder =
    (db
      .select({ m: max(providersTable.order) })
      .from(providersTable)
      .get()?.m ?? -1) + 1;
  const [created] = db
    .insert(providersTable)
    .values({ ...data, apiKey: data.apiKey ?? "", order: nextOrder })
    .returning({ id: providersTable.id })
    .all();
  if (!created) return null;
  return db.select().from(providersTable).where(eq(providersTable.id, created.id)).get() ?? null;
}
