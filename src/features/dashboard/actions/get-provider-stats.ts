"use server";

import { requireSessionOrRedirect } from "@/shared/auth/guard";
import type { Range } from "@/shared/lib/ranges";
import { rangeHours } from "@/shared/lib/ranges";
import type { ServerActionResult } from "@/shared/types";

import type { ProviderStat } from "../model/types";
import { fetchProviderStats } from "../server/fetch-provider-stats";

export async function getProviderStats(range: Range): Promise<ServerActionResult<ProviderStat[]>> {
  await requireSessionOrRedirect();
  const { hours } = rangeHours(range);
  return { success: true, message: "", data: fetchProviderStats(hours) };
}
