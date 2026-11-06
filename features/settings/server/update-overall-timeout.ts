import "server-only";
import { getDb } from "@/shared/db/client";
import { settingsTable } from "@/shared/db/schemas";

export function updateOverallTimeoutSec(timeoutSec: number): number {
  const value = String(timeoutSec);
  getDb()
    .insert(settingsTable)
    .values({ key: "overall_timeout_sec", value })
    .onConflictDoUpdate({ target: settingsTable.key, set: { value } })
    .run();
  return timeoutSec;
}
