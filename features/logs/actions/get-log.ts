"use server";

import { requireSessionOrRedirect } from "@/shared/auth/guard";
import type { ServerActionResult } from "@/shared/types";

import type { LogDetail } from "../model/types";
import { findLog } from "../server/find-log";

export async function getLog(id: string): Promise<ServerActionResult<LogDetail>> {
  await requireSessionOrRedirect();
  if (typeof id !== "string" || id.length === 0)
    return { success: false, message: "Invalid id", data: null };
  const row = findLog(id);
  if (!row) return { success: false, message: "Not found", data: null };
  return { success: true, message: "", data: row };
}
