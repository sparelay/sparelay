import { describe, expect, it } from "vitest";

import { resolveSearchStatus, type SearchTally } from "./search-status";

function tally(overrides: Partial<SearchTally> = {}): SearchTally {
  return {
    enabledProviders: 2,
    availableProviders: 2,
    attempts: 2,
    results: 0,
    sawEmptyResponse: false,
    sawError: false,
    timedOut: false,
    lastError: null,
    ...overrides,
  };
}

describe("resolveSearchStatus", () => {
  it("returns success when results were found", () => {
    expect(resolveSearchStatus(tally({ results: 3 }))).toEqual({
      type: "success",
      reason: null,
      message: null,
    });
  });

  it("reports no-providers when nothing is configured", () => {
    expect(resolveSearchStatus(tally({ enabledProviders: 0, availableProviders: 0 }))).toEqual({
      type: "error",
      reason: "no-providers",
      message: "No providers are configured",
    });
  });

  it("reports all-cooling when every provider is cooling down", () => {
    expect(resolveSearchStatus(tally({ availableProviders: 0 }))).toEqual({
      type: "error",
      reason: "all-cooling",
      message: "All providers are cooling down",
    });
  });

  it("returns empty when providers responded without results", () => {
    expect(resolveSearchStatus(tally({ sawEmptyResponse: true }))).toEqual({
      type: "empty",
      reason: "all-empty",
      message: null,
    });
  });

  it("prioritizes the timeout over empty responses", () => {
    expect(
      resolveSearchStatus(tally({ sawEmptyResponse: true, timedOut: true, lastError: "slow" })),
    ).toEqual({ type: "error", reason: "timeout", message: "slow" });
  });

  it("returns all-failed with the last error when every attempt failed", () => {
    expect(resolveSearchStatus(tally({ sawError: true, lastError: "boom" }))).toEqual({
      type: "error",
      reason: "all-failed",
      message: "boom",
    });
  });

  it("falls back to a generic message when no error was recorded", () => {
    expect(resolveSearchStatus(tally()).message).toBe("No provider returned results");
  });
});
