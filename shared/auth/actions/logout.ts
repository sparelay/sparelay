"use server";

import type { ServerActionResult } from "@/shared/types";

import { destroySession } from "../session";

export async function logoutAction(): Promise<ServerActionResult<null>> {
  await destroySession();
  return { success: true, message: "", data: null };
}
