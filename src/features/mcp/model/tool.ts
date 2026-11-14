import { z } from "zod";

import { searchInputSchema } from "@/features/search/model/search";

export const inputSchema = searchInputSchema.extend({
  query: searchInputSchema.shape.query.describe("Search query"),
  count: searchInputSchema.shape.count.describe("Max results (default 10)"),
});

export const outputSchema = {
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
};

export const description =
  "Search the web via the gateway fallback chain. Returns results with link/title/snippet plus the provider that handled the query, attempts, status (success/empty/error), and durationMs.";
