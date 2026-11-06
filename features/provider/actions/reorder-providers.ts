"use server";

import { requireSessionOrRedirect } from "@/shared/auth/guard";
import { z } from "@/shared/lib/zod";
import type { ServerActionResult } from "@/shared/types";

import { providerIdSchema } from "../model/common";
import type { ProviderOutput } from "../model/provider";
import { findAllProviders } from "../server/find-all-providers";
import { toProviderOutput } from "../server/lib/to-provider-output";
import { reorderProvidersByIds } from "../server/reorder-providers";

export async function reorderProviders(
  ids: string[],
): Promise<ServerActionResult<ProviderOutput[]>> {
  await requireSessionOrRedirect();
  const parsed = z.array(providerIdSchema).safeParse(ids);
  if (!parsed.success) {
    return { success: false, message: "Ids must be string array", data: null };
  }
  const ordered = parsed.data;

  const existing = findAllProviders();
  const set = new Set(existing.map((r) => r.id));
  if (ordered.length !== set.size || !ordered.every((id) => set.has(id))) {
    return { success: false, message: "Ids must match all providers exactly", data: null };
  }
  reorderProvidersByIds(ordered);
  const data = findAllProviders()
    .map(toProviderOutput)
    .filter((p): p is ProviderOutput => p !== null);
  return { success: true, message: "Order saved", data };
}
