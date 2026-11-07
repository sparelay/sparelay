"use server";

import { requireSessionOrRedirect } from "@/shared/auth/guard";
import type { ServerActionResult } from "@/shared/types";

import { rangeHours } from "../lib/ranges";
import type { Range } from "../model/types";
import { fetchP95Latency } from "../server/fetch-p95-latency";

export async function getP95Latency(range: Range): Promise<ServerActionResult<number>> {
  await requireSessionOrRedirect();
  const { hours } = rangeHours(range);
  return { success: true, message: "", data: fetchP95Latency(hours) };
}
