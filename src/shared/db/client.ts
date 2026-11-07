import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import * as schema from "./schemas";

export const DB_PATH = process.env.DB_PATH ?? "./data/database.sqlite";

type Db = BetterSQLite3Database<typeof schema>;

let db: Db | null = null;

function migrationsFolder(): string {
  return path.join(process.cwd(), "drizzle");
}

export function getDb(): Db {
  if (!db) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    const client = new Database(DB_PATH);
    client.pragma("journal_mode = WAL");
    client.pragma("foreign_keys = ON");
    db = drizzle(client, { schema });
    migrate(db, { migrationsFolder: migrationsFolder() });
  }
  return db;
}
