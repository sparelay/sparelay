"use server";

import { parseWithZod } from "@conform-to/zod/v4";

import { createLog } from "@/features/logs/server/create-log";
import { findProvider } from "@/features/provider/server/find-provider";
import type { SearchProvider } from "@/features/search/model/provider";
import type { SearchResponse } from "@/features/search/model/search";
import { createProvider } from "@/features/search/server/create-provider";
import { search as searchWithFallback, searchByProvider } from "@/features/search/server/search";
import { requireSessionOrRedirect } from "@/shared/auth/guard";
import type { FormActionState } from "@/shared/types";

import { playgroundFormSchema } from "../model/schema";
import type { PlaygroundResult } from "../model/types";

export async function search(
  _prevState: FormActionState<PlaygroundResult> | null,
  formData: FormData,
): Promise<FormActionState<PlaygroundResult>> {
  await requireSessionOrRedirect();
  const submission = parseWithZod(formData, { schema: playgroundFormSchema });
  if (submission.status !== "success") {
    return {
      status: "error",
      message: "Invalid input",
      submission: submission.reply(),
      data: null,
    };
  }
  const { providerId, query, count } = submission.value;

  const started = Date.now();
  let outcome: SearchResponse;

  if (providerId === "*") {
    outcome = await searchWithFallback(query, count);
  } else {
    const row = findProvider(providerId);
    if (!row) {
      return {
        status: "error",
        message: "Provider not found",
        submission: { status: "error", error: { "": ["Provider not found"] } },
        data: null,
      };
    }

    let provider: SearchProvider;
    try {
      provider = createProvider(row);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid provider config";
      return {
        status: "error",
        message,
        submission: { status: "error", error: { "": [message] } },
        data: null,
      };
    }

    outcome = await searchByProvider(provider, query, count, row.timeoutSec * 1000, row.cooldown);
  }
  const durationMs = Date.now() - started;

  createLog({
    query,
    providerName: outcome.provider?.name ?? null,
    providerType: outcome.provider?.type ?? null,
    attempts: outcome.attempts,
    resultsCount: outcome.results.length,
    durationMs,
    success: outcome.status.type === "success",
    source: "playground",
    resultsJson: outcome.results,
  });

  if (outcome.status.type === "error") {
    const message = outcome.status.message ?? "Search failed";
    return {
      status: "error",
      message,
      submission: { status: "error", error: { "": [message] } },
      data: null,
    };
  }
  return {
    status: "success",
    message: "",
    submission: submission.reply(),
    data: {
      results: outcome.results,
      providerName: outcome.provider?.name ?? null,
      attempts: outcome.attempts,
      durationMs,
    },
  };
}
