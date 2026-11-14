import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";

import { createLog } from "@/features/logs/server/create-log";
import { searchInputSchema } from "@/features/search/model/search";
import { search } from "@/features/search/server/search";
import { requireApiKey } from "@/shared/auth/guard";

import pkg from "../../../package.json";
import { buildSearchToolResult } from "./tool-result";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const inputSchema = searchInputSchema.extend({
  query: searchInputSchema.shape.query.describe("Search query"),
  count: searchInputSchema.shape.count.describe("Max results (default 10)"),
});

const outputSchema = {
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

function buildServer() {
  const server = new McpServer({ name: pkg.name, version: pkg.version });

  server.registerTool(
    "search_web",
    {
      description:
        "Search the web via the gateway fallback chain. Returns results with link/title/snippet plus the provider that handled the query, attempts, status (success/empty/error), and durationMs.",
      inputSchema,
      outputSchema,
    },
    async ({ query, count }) => {
      try {
        const started = Date.now();
        const outcome = await search(query, count);
        const durationMs = Date.now() - started;
        createLog({
          query,
          providerName: outcome.provider?.name ?? null,
          providerType: outcome.provider?.type ?? null,
          attempts: outcome.attempts,
          resultsCount: outcome.results.length,
          durationMs,
          success: outcome.status.type === "success",
          source: "mcp",
          resultsJson: outcome.results,
        });
        return buildSearchToolResult(outcome, durationMs);
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Search failed: ${error instanceof Error ? error.message : "unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  return server;
}

export async function POST(req: Request) {
  const unauthorized = requireApiKey(req);
  if (unauthorized) return unauthorized;

  const transport = new WebStandardStreamableHTTPServerTransport();
  const server = buildServer();
  await server.connect(transport);
  return transport.handleRequest(req);
}
