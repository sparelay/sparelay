"use server";

import { requireSessionOrRedirect } from "@/shared/auth/guard";
import type { Range } from "@/shared/lib/ranges";
import { rangeHours } from "@/shared/lib/ranges";
import type { ServerActionResult } from "@/shared/types";

import { countFallbacks } from "../server/count-fallbacks";

export async function getFallbacks(range: Range): Promise<ServerActionResult<number>> {
  await requireSessionOrRedirect();
  const { hours } = rangeHours(range);
  return { success: true, message: "", data: countFallbacks(hours) };
}
