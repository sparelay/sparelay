"use server";

import { requireSessionOrRedirect } from "@/shared/auth/guard";
import type { ServerActionResult } from "@/shared/types";

import { rangeHours } from "../lib/ranges";
import type { Range } from "../model/types";
import type { ProviderStat } from "../model/types";
import { fetchProviderStats } from "../server/fetch-provider-stats";

export async function getProviderStats(range: Range): Promise<ServerActionResult<ProviderStat[]>> {
  await requireSessionOrRedirect();
  const { hours } = rangeHours(range);
  return { success: true, message: "", data: fetchProviderStats(hours) };
}
