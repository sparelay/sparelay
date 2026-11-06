import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const searchLogsTable = sqliteTable(
  "search_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    query: text("query").notNull(),
    providerName: text("provider_name"),
    providerType: text("provider_type"),
    attempts: integer("attempts").notNull().default(0),
    resultsCount: integer("results_count").notNull().default(0),
    durationMs: integer("duration_ms").notNull().default(0),
    success: integer("success", { mode: "boolean" }).notNull().default(false),
    source: text("source").notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    resultsJson: text("results_json", { mode: "json" })
      .$type<{ link: string; title: string; snippet: string }[]>()
      .notNull()
      .default([]),
  },
  (t) => [index("idx_logs_created").on(t.createdAt), index("idx_logs_provider").on(t.providerName)],
);
