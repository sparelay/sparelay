"use server";

import { requireSessionOrRedirect } from "@/shared/auth/guard";
import type { ServerActionResult } from "@/shared/types";

import { rangeHours } from "../lib/ranges";
import type { Range } from "../model/types";
import type { Point } from "../model/types";
import { fetchPoints } from "../server/fetch-points";

export async function getPoints(
  range: Range,
): Promise<ServerActionResult<{ points: Point[]; capped: boolean }>> {
  await requireSessionOrRedirect();
  const { hours } = rangeHours(range);
  return { success: true, message: "", data: fetchPoints(hours) };
}
