import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import type { SearchResponse } from "@/features/search/model/search";

export type SearchToolStatus = "success" | "empty" | "error";

export interface SearchToolStructured {
  results: SearchResponse["results"];
  provider: SearchResponse["provider"];
  attempts: number;
  durationMs: number;
  status: SearchToolStatus;
  message: string | null;
}

function statusOf(outcome: SearchResponse): SearchToolStatus {
  if (outcome.status.type === "error") return "error";
  return outcome.results.length > 0 ? "success" : "empty";
}

/**
 * Maps a search outcome to the MCP tool result: structured content for
 * clients that understand output schemas, a text fallback for the rest,
 * and isError so agents can tell a failed search from an empty one.
 */
export function buildSearchToolResult(outcome: SearchResponse, durationMs: number): CallToolResult {
  const status = statusOf(outcome);
  const structured: SearchToolStructured = {
    results: outcome.results,
    provider: outcome.provider,
    attempts: outcome.attempts,
    durationMs,
    status,
    message: outcome.status.message,
  };
  return {
    content: [
      {
        type: "text",
        text:
          status === "error"
            ? `Search failed: ${outcome.status.message ?? "unknown error"}`
            : JSON.stringify(outcome.results),
      },
    ],
    structuredContent: structured as unknown as Record<string, unknown>,
    isError: status === "error",
  };
}
