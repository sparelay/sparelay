"use server";

import { requireSessionOrRedirect } from "@/shared/auth/guard";
import type { ServerActionResult } from "@/shared/types";

import { providerIdSchema } from "../model/common";
import type { ProviderOutput } from "../model/provider";
import { toProviderOutput } from "../server/lib/to-provider-output";
import { toggleProviderById } from "../server/toggle-provider";

export async function toggleProvider(id: string): Promise<ServerActionResult<ProviderOutput>> {
  await requireSessionOrRedirect();
  const parsedId = providerIdSchema.safeParse(id);
  if (!parsedId.success) return { success: false, message: "Invalid id", data: null };

  const row = toggleProviderById(parsedId.data);
  if (!row) return { success: false, message: "Not found", data: null };

  const output = toProviderOutput(row);
  if (!output) return { success: false, message: "Unknown provider type", data: null };
  return { success: true, message: "Saved", data: output };
}
