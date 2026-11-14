import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import type { SearchResponse } from "@/features/search/model/search";

/** JSON Schema (zod raw shape) for the `search_web` structured result. */
export const searchWebOutputSchema = {
  results: z.array(
    z.object({
      link: z.string().describe("Result URL"),
      title: z.string(),
      snippet: z.string(),
    }),
  ),
  provider: z
    .object({ name: z.string(), type: z.string() })
    .nullable()
    .describe("Provider that produced the results, null when none did"),
  attempts: z.number().describe("Providers tried before the result"),
  durationMs: z.number(),
  status: z
    .enum(["success", "empty", "error"])
    .describe(
      "success: results found; empty: no results without errors; error: every attempt failed",
    ),
  message: z.string().nullable().describe("Failure reason when status is error"),
} satisfies Record<string, z.ZodType>;

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
