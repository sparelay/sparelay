import "server-only";
import { eq } from "drizzle-orm";

import { getDb } from "@/shared/db/client";
import { settingsTable } from "@/shared/db/schemas";

import { TIMEZONES } from "../model/timezones";

export function fetchTimezone(): string {
  const row = getDb()
    .select({ value: settingsTable.value })
    .from(settingsTable)
    .where(eq(settingsTable.key, "timezone"))
    .get();
  const tz = row?.value ?? "UTC";
  return TIMEZONES.includes(tz) ? tz : "UTC";
}
