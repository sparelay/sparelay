import { beforeEach, describe, expect, it, vi } from "vitest";

import { findAllEnabledProviders } from "@/features/provider/server/find-all-providers";
import { startProviderCooldown } from "@/features/provider/server/start-provider-cooldown";
import { fetchOverallTimeoutMs } from "@/features/settings/server/fetch-overall-timeout";
import type { ProviderRow } from "@/shared/db/types";

import type { SearchProvider } from "../model/provider";
import type { SearchResult } from "../model/search";
import { createProvider } from "./create-provider";
import { ProviderHttpError } from "./lib/provider-http-error";
import { search, searchByProvider } from "./search";

vi.mock("@/features/provider/server/find-all-providers", () => ({
  findAllEnabledProviders: vi.fn(),
}));
vi.mock("@/features/settings/server/fetch-overall-timeout", () => ({
  fetchOverallTimeoutMs: vi.fn(),
}));
vi.mock("@/features/provider/server/start-provider-cooldown", () => ({
  startProviderCooldown: vi.fn(),
}));
vi.mock("./create-provider", () => ({
  createProvider: vi.fn(),
}));

const hit: SearchResult = { link: "https://a", title: "A", snippet: "a" };

function row(overrides: Partial<ProviderRow> = {}): ProviderRow {
  return {
    id: "id",
    type: "tavily",
    name: "Tavily",
    baseUrl: "https://api.tavily.test",
    apiKey: "key",
    enabled: true,
    fallbackOnEmpty: true,
    timeoutSec: 5,
    cooldown: 60,
    cooldownUntil: null,
    order: 0,
    extra: {},
    createdAt: "2026-01-01 00:00:00",
    updatedAt: "2026-01-01 00:00:00",
    ...overrides,
  };
}

function provider(name: string, impl: () => Promise<SearchResult[]>): SearchProvider {
  return {
    type: "tavily",
    config: { id: "id", name, baseUrl: "https://api.tavily.test", apiKey: "key", extra: {} },
    search: impl,
  };
}

beforeEach(() => {
  vi.mocked(fetchOverallTimeoutMs).mockReturnValue(10_000);
  vi.mocked(findAllEnabledProviders).mockReturnValue([]);
  vi.mocked(createProvider).mockReset();
  vi.mocked(startProviderCooldown).mockReset();
});

describe("search", () => {
  it("returns the first provider that answers", async () => {
    vi.mocked(findAllEnabledProviders).mockReturnValue([row({ name: "A" })]);
    vi.mocked(createProvider).mockReturnValue(provider("A", async () => [hit]));

    const result = await search("q", 5);

    expect(result.results).toEqual([hit]);
    expect(result.provider).toEqual({ name: "A", type: "tavily" });
    expect(result.attempts).toBe(1);
    expect(result.status).toEqual({ type: "success", message: null });
  });

  it("falls back when a provider returns no results and fallbackOnEmpty is set", async () => {
    vi.mocked(findAllEnabledProviders).mockReturnValue([
      row({ name: "A", fallbackOnEmpty: true }),
      row({ name: "B", fallbackOnEmpty: false }),
    ]);
    vi.mocked(createProvider)
      .mockReturnValueOnce(provider("A", async () => []))
      .mockReturnValueOnce(provider("B", async () => [hit]));

    const result = await search("q", 5);

    expect(result.provider).toEqual({ name: "B", type: "tavily" });
    expect(result.attempts).toBe(2);
    expect(result.results).toEqual([hit]);
  });

  it("returns an empty success when fallbackOnEmpty is disabled", async () => {
    vi.mocked(findAllEnabledProviders).mockReturnValue([
      row({ name: "A", fallbackOnEmpty: false }),
    ]);
    vi.mocked(createProvider).mockReturnValue(provider("A", async () => []));

    const result = await search("q", 5);

    expect(result.results).toEqual([]);
    expect(result.provider).toEqual({ name: "A", type: "tavily" });
    expect(result.status).toEqual({ type: "success", message: null });
  });

  it("tries the next provider when one throws", async () => {
    vi.mocked(findAllEnabledProviders).mockReturnValue([row({ name: "A" }), row({ name: "B" })]);
    vi.mocked(createProvider)
      .mockReturnValueOnce(
        provider("A", async () => {
          throw new Error("boom");
        }),
      )
      .mockReturnValueOnce(provider("B", async () => [hit]));

    const result = await search("q", 5);

    expect(result.provider).toEqual({ name: "B", type: "tavily" });
    expect(result.attempts).toBe(2);
  });

  it("reports the last error when every provider fails", async () => {
    vi.mocked(findAllEnabledProviders).mockReturnValue([row({ name: "A" }), row({ name: "B" })]);
    vi.mocked(createProvider)
      .mockReturnValueOnce(
        provider("A", async () => {
          throw new Error("first");
        }),
      )
      .mockReturnValueOnce(
        provider("B", async () => {
          throw new Error("second");
        }),
      );

    const result = await search("q", 5);

    expect(result.provider).toBeNull();
    expect(result.results).toEqual([]);
    expect(result.status).toEqual({ type: "error", message: "second" });
  });

  it("skips providers that are cooling down", async () => {
    vi.mocked(findAllEnabledProviders).mockReturnValue([
      row({ name: "A", cooldownUntil: "2999-01-01 00:00:00" }),
      row({ name: "B" }),
    ]);
    vi.mocked(createProvider).mockReturnValue(provider("B", async () => [hit]));

    const result = await search("q", 5);

    expect(result.provider).toEqual({ name: "B", type: "tavily" });
    expect(result.attempts).toBe(1);
    expect(createProvider).toHaveBeenCalledTimes(1);
  });

  it("returns an error when every provider is cooling down", async () => {
    vi.mocked(findAllEnabledProviders).mockReturnValue([
      row({ name: "A", cooldownUntil: "2999-01-01 00:00:00" }),
    ]);

    const result = await search("q", 5);

    expect(result.attempts).toBe(0);
    expect(result.status).toEqual({ type: "error", message: "All providers are cooling down" });
    expect(createProvider).not.toHaveBeenCalled();
  });

  it("does not set a cooldown when the provider cooldown is disabled", async () => {
    vi.mocked(findAllEnabledProviders).mockReturnValue([row({ name: "A", cooldown: 0 })]);
    vi.mocked(createProvider).mockReturnValue(
      provider("A", async () => {
        throw new ProviderHttpError("tavily", 429);
      }),
    );

    await search("q", 5);

    expect(startProviderCooldown).not.toHaveBeenCalled();
  });

  it("starts a cooldown when a provider returns 429", async () => {
    vi.mocked(findAllEnabledProviders).mockReturnValue([row({ name: "A", cooldown: 120 })]);
    vi.mocked(createProvider).mockReturnValue(
      provider("A", async () => {
        throw new ProviderHttpError("tavily", 429);
      }),
    );

    await search("q", 5);

    expect(startProviderCooldown).toHaveBeenCalledWith("id", 120);
  });

  it("stops before calling a provider when the budget is exhausted", async () => {
    vi.mocked(fetchOverallTimeoutMs).mockReturnValue(0);
    vi.mocked(findAllEnabledProviders).mockReturnValue([row({ name: "A" })]);

    const result = await search("q", 5);

    expect(result.attempts).toBe(0);
    expect(result.status).toEqual({ type: "error", message: "No provider returned results" });
    expect(createProvider).not.toHaveBeenCalled();
  });
});

describe("searchByProvider", () => {
  it("returns the provider that answered", async () => {
    const result = await searchByProvider(
      provider("A", async () => [hit]),
      "q",
      5,
      1000,
    );

    expect(result.results).toEqual([hit]);
    expect(result.provider).toEqual({ name: "A", type: "tavily" });
    expect(result.attempts).toBe(1);
    expect(result.status).toEqual({ type: "success", message: null });
  });

  it("returns the error and keeps the attempted provider", async () => {
    const result = await searchByProvider(
      provider("A", async () => {
        throw new Error("boom");
      }),
      "q",
      5,
      1000,
    );

    expect(result.results).toEqual([]);
    expect(result.provider).toEqual({ name: "A", type: "tavily" });
    expect(result.status).toEqual({ type: "error", message: "boom" });
  });

  it("starts a cooldown on 429 with the explicit cooldown seconds", async () => {
    const result = await searchByProvider(
      provider("A", async () => {
        throw new ProviderHttpError("tavily", 429);
      }),
      "q",
      5,
      1000,
      30,
    );

    expect(result.status.type).toBe("error");
    expect(startProviderCooldown).toHaveBeenCalledWith("id", 30);
  });
});
