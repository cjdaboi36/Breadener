import { Database } from "@db/sqlite";

export const db = new Database(new URL("../daataabaasaa.db", import.meta.url));

db.exec(`
        CREATE TABLE IF NOT EXISTS infections (
        infector_id TEXT PRIMARY KEY,
        infected_id TEXT KEY
        )
    `);
