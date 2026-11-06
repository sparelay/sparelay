import "server-only";
import { getDb } from "@/shared/db/client";
import { settingsTable } from "@/shared/db/schemas";

import { TIMEZONES } from "../model/timezones";

const DEFAULT_OVERALL_TIMEOUT_SEC = 30;

export function fetchAllSettings(): { timezone: string; overallTimeoutSec: number } {
  const rows = getDb()
    .select({ key: settingsTable.key, value: settingsTable.value })
    .from(settingsTable)
    .all();
  const values = new Map(rows.map((row) => [row.key, row.value]));

  const tz = values.get("timezone") ?? "UTC";
  const sec = Math.floor(Number(values.get("overall_timeout_sec") ?? DEFAULT_OVERALL_TIMEOUT_SEC));

  return {
    timezone: TIMEZONES.includes(tz) ? tz : "UTC",
    overallTimeoutSec: Number.isFinite(sec) && sec > 0 ? sec : DEFAULT_OVERALL_TIMEOUT_SEC,
  };
}
