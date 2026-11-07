"use server";

import { requireSessionOrRedirect } from "@/shared/auth/guard";
import type { ServerActionResult } from "@/shared/types";

import { rangeHours } from "../lib/ranges";
import type { Range } from "../model/types";
import { fetchAvgLatency } from "../server/fetch-avg-latency";

export async function getAvgLatency(range: Range): Promise<ServerActionResult<number>> {
  await requireSessionOrRedirect();
  const { hours } = rangeHours(range);
  return { success: true, message: "", data: fetchAvgLatency(hours) };
}
