import { Database } from "@db/sqlite";
import { config } from "$src/config.ts";

const basePath: URL = new URL("../", import.meta.url);
export const db: Database = new Database(
  new URL(config.DATABASE_PATH, basePath),
);

db.exec(`
        CREATE TABLE IF NOT EXISTS infections (
        infectedId TEXT PRIMARY KEY,
        infectorId TEXT KEY
        )
    `);
