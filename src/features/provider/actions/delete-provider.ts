"use server";

import { requireSessionOrRedirect } from "@/shared/auth/guard";
import type { ServerActionResult } from "@/shared/types";

import { providerIdSchema } from "../model/common";
import { deleteProviderById } from "../server/delete-provider";
import { findProvider } from "../server/find-provider";

export async function deleteProvider(id: string): Promise<ServerActionResult<null>> {
  await requireSessionOrRedirect();
  const parsed = providerIdSchema.safeParse(id);
  if (!parsed.success)
    return {
      success: false,
      message: "Invalid id",
      data: null,
    };

  const exists = findProvider(parsed.data);
  if (!exists)
    return {
      success: false,
      message: "Not found",
      data: null,
    };

  deleteProviderById(parsed.data);

  return {
    success: true,
    message: "Deleted",
    data: null,
  };
}
