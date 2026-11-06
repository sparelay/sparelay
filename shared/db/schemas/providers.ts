import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const providersTable = sqliteTable("providers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  type: text("type").notNull(),
  name: text("name").notNull(),
  baseUrl: text("base_url").notNull().default(""),
  apiKey: text("api_key").notNull().default(""),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  fallbackOnEmpty: integer("fallback_on_empty", { mode: "boolean" }).notNull().default(true),
  timeoutSec: integer("timeout_sec").notNull().default(5),
  cooldown: integer("cooldown").notNull().default(60),
  cooldownUntil: text("cooldown_until"),
  order: integer("order").notNull(),
  extra: text("extra", { mode: "json" }).$type<Record<string, string>>().notNull().default({}),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});
