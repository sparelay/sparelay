import "server-only";
import { isCoolingDown } from "@/features/provider/lib/cooldown";
import { findAllEnabledProviders } from "@/features/provider/server/find-all-providers";
import { startProviderCooldown } from "@/features/provider/server/start-provider-cooldown";
import { fetchOverallTimeoutMs } from "@/features/settings/server/fetch-overall-timeout";

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
  if (availableProviders.length === 0) {
    return {
      results: [],
      provider: null,
      attempts: 0,
      status: {
        type: "error",
        message:
          enabledProviders.length > 0
            ? "All providers are cooling down"
            : "No provider returned results",
      },
    };
  }

  let attempts = 0;
  let lastError: string | null = null;
  for (const enabledProvider of availableProviders) {
    const elapsed = Date.now() - started;
    const remaining = overallTimeoutMs - elapsed;
    if (remaining <= 0) break;
    const budget = Math.min(enabledProvider.timeoutSec * 1000, remaining);
    attempts += 1;
    try {
      const provider = createProvider(enabledProvider);
      const results = await provider.search(query, count, budget);
      if (results.length === 0 && enabledProvider.fallbackOnEmpty) continue;
      return {
        results,
        provider: { name: enabledProvider.name, type: enabledProvider.type },
        attempts,
        status: { type: "success", message: null },
      };
    } catch (error) {
      if (
        error instanceof ProviderHttpError &&
        error.status === 429 &&
        enabledProvider.cooldown > 0
      ) {
        startProviderCooldown(enabledProvider.id, enabledProvider.cooldown);
      }
      lastError = error instanceof Error ? error.message : "Search failed";
      continue;
    }
  }
  return {
    results: [],
    provider: null,
    attempts,
    status: { type: "error", message: lastError ?? "No provider returned results" },
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
      status: { type: "success", message: null },
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
        message: error instanceof Error ? error.message : "Search failed",
      },
    };
  }
}
