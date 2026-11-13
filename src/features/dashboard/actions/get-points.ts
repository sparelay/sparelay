"use server";

import { requireSessionOrRedirect } from "@/shared/auth/guard";
import type { Range } from "@/shared/lib/ranges";
import { rangeHours } from "@/shared/lib/ranges";
import type { ServerActionResult } from "@/shared/types";

import type { Point } from "../model/types";
import { fetchPoints } from "../server/fetch-points";

export async function getPoints(
  range: Range,
): Promise<ServerActionResult<{ points: Point[]; capped: boolean }>> {
  await requireSessionOrRedirect();
  const { hours } = rangeHours(range);
  return { success: true, message: "", data: fetchPoints(hours) };
}
