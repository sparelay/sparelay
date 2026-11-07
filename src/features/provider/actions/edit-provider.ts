"use server";

import { requireSessionOrRedirect } from "@/shared/auth/guard";
import type { FormActionState } from "@/shared/types";

import { parseProviderForm } from "../lib/parse-provider-form";
import { toProviderType } from "../lib/to-provider-type";
import { providerIdSchema } from "../model/common";
import { PROVIDER_REGISTRY } from "../model/provider";
import { findProvider } from "../server/find-provider";
import { updateProviderById } from "../server/update-provider";

export async function editProvider(
  _prevState: FormActionState | null,
  formData: FormData,
): Promise<FormActionState> {
  await requireSessionOrRedirect();
  const idResult = providerIdSchema.safeParse(formData.get("id"));
  if (!idResult.success) {
    return {
      status: "error",
      message: "Invalid id",
      submission: { status: "error", error: { id: ["Invalid id"] } },
      data: null,
    };
  }
  const existing = findProvider(idResult.data);
  if (!existing) {
    return {
      status: "error",
      message: "Not found",
      submission: { status: "error", error: { id: ["Not found"] } },
      data: null,
    };
  }
  const dbType = toProviderType(existing.type);
  if (!dbType) {
    return {
      status: "error",
      message: "Unknown provider type",
      submission: { status: "error", error: { id: ["Unknown provider type"] } },
      data: null,
    };
  }

  const submission = parseProviderForm(PROVIDER_REGISTRY[dbType].schema.edit, formData);
  if (submission.status !== "success") {
    return {
      status: "error",
      message: "Invalid input",
      submission: submission.reply(),
      data: null,
    };
  }
  const { id: _id, type: _type, apiKey, ...data } = submission.value;
  updateProviderById(existing.id, {
    ...data,
    ...(apiKey ? { apiKey } : {}),
  });
  return { status: "success", message: "Saved", submission: submission.reply(), data: null };
}
