import "server-only";
import { eq } from "drizzle-orm";

import { getDb } from "@/shared/db/client";
import { settingsTable } from "@/shared/db/schemas";

const DEFAULT_OVERALL_TIMEOUT_MS = 30_000;

export function fetchOverallTimeoutMs(): number {
  const row = getDb()
    .select({ value: settingsTable.value })
    .from(settingsTable)
    .where(eq(settingsTable.key, "overall_timeout_sec"))
    .get();
  const sec = Math.floor(Number(row?.value ?? "30"));
  return Number.isFinite(sec) && sec > 0 ? sec * 1000 : DEFAULT_OVERALL_TIMEOUT_MS;
}
