import { Database } from "@db/sqlite";
import { config } from "$src/config.ts";

const base_path: URL = new URL("../", import.meta.url);
export const db: Database = new Database(
  new URL(config.DATABASE_PATH, base_path),
);

db.exec(`
        CREATE TABLE IF NOT EXISTS infections (
        infected_id TEXT PRIMARY KEY,
        infector_id TEXT KEY
        )
    `);
