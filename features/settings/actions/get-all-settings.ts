"use server";

import { requireSessionOrRedirect } from "@/shared/auth/guard";
import type { ServerActionResult } from "@/shared/types";

import { fetchAllSettings } from "../server/fetch-all-settings";

export interface AllSettings {
  timezone: string;
  overallTimeoutSec: number;
}

export async function getAllSettings(): Promise<ServerActionResult<AllSettings>> {
  await requireSessionOrRedirect();
  return { success: true, message: "", data: fetchAllSettings() };
}
