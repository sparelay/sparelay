import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DB_PATH?.trim() || "./data/database.sqlite";

export default defineConfig({
  schema: "./src/shared/db/schemas",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: databaseUrl,
  },
});
