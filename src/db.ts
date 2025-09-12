import { Database } from "@db/sqlite";
import { config } from "./config.ts";

const base_path: URL = new URL("../", import.meta.url);
export const db: Database = new Database(new URL(config.DATABASE_PATH, base_path));

db.exec(`
        CREATE TABLE IF NOT EXISTS infections (
        infector_id TEXT PRIMARY KEY,
        infected_id TEXT KEY
        )
    `);
