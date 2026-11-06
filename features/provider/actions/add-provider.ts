"use server";

import { requireSessionOrRedirect } from "@/shared/auth/guard";
import type { FormActionState } from "@/shared/types";

import { parseProviderForm } from "../lib/parse-provider-form";
import { PROVIDER_REGISTRY, providerTypeSchema } from "../model/provider";
import { createProvider } from "../server/create-provider";

export async function addProvider(
  _prevState: FormActionState | null,
  formData: FormData,
): Promise<FormActionState> {
  await requireSessionOrRedirect();
  const parsedType = providerTypeSchema.safeParse(formData.get("type"));
  if (!parsedType.success) {
    return {
      status: "error",
      message: "Invalid provider type",
      submission: { status: "error", error: { type: ["Invalid provider type"] } },
      data: null,
    };
  }
  const type = parsedType.data;

  const submission = parseProviderForm(PROVIDER_REGISTRY[type].schema.add, formData);
  if (submission.status !== "success") {
    return {
      status: "error",
      message: "Invalid input",
      submission: submission.reply(),
      data: null,
    };
  }
  const { name, baseUrl, apiKey, enabled, timeoutSec, cooldown, fallbackOnEmpty, extra } =
    submission.value;
  const row = createProvider({
    type,
    name,
    baseUrl,
    apiKey,
    enabled,
    timeoutSec,
    cooldown,
    fallbackOnEmpty,
    extra,
  });
  if (!row) {
    return {
      status: "error",
      message: "Save failed",
      submission: submission.reply({ formErrors: ["Save failed"] }),
      data: null,
    };
  }
  return { status: "success", message: "Saved", submission: submission.reply(), data: null };
}
