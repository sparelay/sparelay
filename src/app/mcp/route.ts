import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

import { createLog } from "@/features/logs/server/create-log";
import { buildSearchToolResult } from "@/features/mcp/model/result";
import { inputSchema, outputSchema, searchWebDescription } from "@/features/mcp/model/schema";
import { search } from "@/features/search/server/search";
import { requireApiKey } from "@/shared/auth/guard";

import pkg from "../../../package.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function buildServer() {
  const server = new McpServer({ name: pkg.name, version: pkg.version });

  server.registerTool(
    "search_web",
    {
      description: searchWebDescription,
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
