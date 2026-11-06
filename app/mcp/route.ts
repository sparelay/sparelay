import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

import { createLog } from "@/features/logs/server/create-log";
import { searchInputSchema } from "@/features/search/model/search";
import { search } from "@/features/search/server/search";
import pkg from "@/package.json";
import { requireApiKey } from "@/shared/auth/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const mcpSearchInputSchema = searchInputSchema.extend({
  query: searchInputSchema.shape.query.describe("Search query"),
  count: searchInputSchema.shape.count.describe("Max results (default 10)"),
});

function buildServer() {
  const server = new McpServer({ name: pkg.name, version: pkg.version });

  server.registerTool(
    "search_web",
    {
      description:
        "Search the web via the gateway fallback chain. Returns title/url/snippet per result.",
      inputSchema: mcpSearchInputSchema,
    },
    async ({ query, count }) => {
      try {
        const started = Date.now();
        const outcome = await search(query, count);
        createLog({
          query,
          providerName: outcome.provider?.name ?? null,
          providerType: outcome.provider?.type ?? null,
          attempts: outcome.attempts,
          resultsCount: outcome.results.length,
          durationMs: Date.now() - started,
          success: outcome.status.type === "success",
          source: "mcp",
          resultsJson: outcome.results,
        });
        return { content: [{ type: "text", text: JSON.stringify(outcome.results) }] };
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
