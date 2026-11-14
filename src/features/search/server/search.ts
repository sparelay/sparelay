import "server-only";
import { isCoolingDown } from "@/features/provider/lib/cooldown";
import { findAllEnabledProviders } from "@/features/provider/server/find-all-providers";
import { startProviderCooldown } from "@/features/provider/server/start-provider-cooldown";
import { fetchOverallTimeoutMs } from "@/features/settings/server/fetch-overall-timeout";

import { resolveSearchStatus } from "../lib/search-status";
import type { SearchProvider } from "../model/provider";
import type { SearchResponse } from "../model/search";
import { createProvider } from "./create-provider";
import { ProviderHttpError } from "./lib/provider-http-error";

export async function search(query: string, count: number): Promise<SearchResponse> {
  const started = Date.now();
  const overallTimeoutMs = fetchOverallTimeoutMs();
  const enabledProviders = findAllEnabledProviders();
  const availableProviders = enabledProviders.filter(
    (provider) => !isCoolingDown(provider.cooldownUntil),
  );

  let attempts = 0;
  let lastError: string | null = null;
  let sawEmptyResponse = false;
  let sawError = false;
  let timedOut = false;

  for (const enabledProvider of availableProviders) {
    const elapsed = Date.now() - started;
    const remaining = overallTimeoutMs - elapsed;
    if (remaining <= 0) {
      timedOut = true;
      break;
    }
    const budget = Math.min(enabledProvider.timeoutSec * 1000, remaining);
    attempts += 1;
    try {
      const provider = createProvider(enabledProvider);
      const results = await provider.search(query, count, budget);
      if (results.length === 0) {
        sawEmptyResponse = true;
        if (enabledProvider.fallbackOnEmpty) continue;
      }
      return {
        results,
        provider: { name: enabledProvider.name, type: enabledProvider.type },
        attempts,
        status: resolveSearchStatus({
          enabledProviders: enabledProviders.length,
          availableProviders: availableProviders.length,
          attempts,
          results: results.length,
          sawEmptyResponse,
          sawError,
          timedOut,
          lastError,
        }),
      };
    } catch (error) {
      if (
        error instanceof ProviderHttpError &&
        error.status === 429 &&
        enabledProvider.cooldown > 0
      ) {
        startProviderCooldown(enabledProvider.id, enabledProvider.cooldown);
      }
      sawError = true;
      lastError = error instanceof Error ? error.message : "Search failed";
      continue;
    }
  }
  return {
    results: [],
    provider: null,
    attempts,
    status: resolveSearchStatus({
      enabledProviders: enabledProviders.length,
      availableProviders: availableProviders.length,
      attempts,
      results: 0,
      sawEmptyResponse,
      sawError,
      timedOut,
      lastError,
    }),
  };
}

export async function searchByProvider(
  provider: SearchProvider,
  query: string,
  count: number,
  timeoutMs: number,
  cooldownSec = 0,
): Promise<SearchResponse> {
  const providerInfo = { name: provider.config.name, type: provider.type };
  try {
    const results = await provider.search(query, count, timeoutMs);
    return {
      results,
      provider: providerInfo,
      attempts: 1,
      status:
        results.length > 0
          ? { type: "success", reason: null, message: null }
          : { type: "empty", reason: "all-empty", message: null },
    };
  } catch (error) {
    if (error instanceof ProviderHttpError && error.status === 429 && cooldownSec > 0) {
      startProviderCooldown(provider.config.id, cooldownSec);
    }
    return {
      results: [],
      provider: providerInfo,
      attempts: 1,
      status: {
        type: "error",
        reason: "all-failed",
        message: error instanceof Error ? error.message : "Search failed",
      },
    };
  }
}
