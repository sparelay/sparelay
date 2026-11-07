import "server-only";
import { getDb } from "@/shared/db/client";
import { searchLogsTable } from "@/shared/db/schemas";

export function createLog(args: {
  query: string;
  providerName: string | null;
  providerType: string | null;
  attempts: number;
  resultsCount: number;
  durationMs: number;
  success: boolean;
  source: string;
  resultsJson: { link: string; title: string; snippet: string }[];
}): void {
  getDb()
    .insert(searchLogsTable)
    .values({
      query: args.query,
      providerName: args.providerName,
      providerType: args.providerType,
      attempts: args.attempts,
      resultsCount: args.resultsCount,
      durationMs: args.durationMs,
      success: args.success,
      source: args.source,
      resultsJson: args.resultsJson,
    })
    .run();
}
