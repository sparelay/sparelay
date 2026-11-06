"use server";

import { requireSessionOrRedirect } from "@/shared/auth/guard";
import type { ServerActionResult } from "@/shared/types";

import type { ProviderOutput } from "../model/provider";
import { findAllProviders } from "../server/find-all-providers";
import { toProviderOutput } from "../server/lib/to-provider-output";

export async function listProviders(): Promise<ServerActionResult<ProviderOutput[]>> {
  await requireSessionOrRedirect();
  const data = findAllProviders()
    .map(toProviderOutput)
    .filter((p): p is ProviderOutput => p !== null);
  return { success: true, message: "", data };
}
