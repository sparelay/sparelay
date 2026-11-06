import "server-only";
import { getDb } from "@/shared/db/client";
import { settingsTable } from "@/shared/db/schemas";

export function updateTimezone(timezone: string): { timezone: string } {
  getDb()
    .insert(settingsTable)
    .values({ key: "timezone", value: timezone })
    .onConflictDoUpdate({ target: settingsTable.key, set: { value: timezone } })
    .run();
  return { timezone };
}
