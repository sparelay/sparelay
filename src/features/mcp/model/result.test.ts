import { describe, expect, it } from "vitest";

import type { SearchResponse } from "@/features/search/model/search";

import { buildSearchToolResult } from "./result";

const result = { link: "https://example.com", title: "Example", snippet: "snippet" };

function outcome(overrides: Partial<SearchResponse> = {}): SearchResponse {
  return {
    results: [],
    provider: null,
    attempts: 0,
    status: { type: "success", reason: null, message: null },
    ...overrides,
  };
}

describe("buildSearchToolResult", () => {
  it("returns structured results with attribution for a successful search", () => {
    const res = buildSearchToolResult(
      outcome({
        results: [result],
        provider: { name: "Exa", type: "exa" },
        attempts: 1,
        status: { type: "success", reason: null, message: null },
      }),
      123,
    );

    expect(res.isError).toBe(false);
    expect(res.structuredContent).toMatchObject({
      results: [result],
      provider: { name: "Exa", type: "exa" },
      attempts: 1,
      durationMs: 123,
      status: "success",
      message: null,
    });
    expect(res.content?.[0]).toMatchObject({ type: "text", text: JSON.stringify([result]) });
  });

  it("keeps an empty search distinct from success and error", () => {
    const res = buildSearchToolResult(
      outcome({ status: { type: "empty", reason: "all-empty", message: null } }),
      50,
    );

    expect(res.isError).toBe(false);
    expect(res.structuredContent).toMatchObject({ status: "empty", results: [] });
  });

  it("marks a failed search as an error with the message and isError", () => {
    const res = buildSearchToolResult(
      outcome({
        attempts: 3,
        status: { type: "error", reason: "all-cooling", message: "All providers are cooling down" },
      }),
      90,
    );

    expect(res.isError).toBe(true);
    expect(res.structuredContent).toMatchObject({
      status: "error",
      attempts: 3,
      message: "All providers are cooling down",
    });
    expect(res.content?.[0]).toMatchObject({
      type: "text",
      text: "Search failed: All providers are cooling down",
    });
  });
});
