import path from "node:path";
import sqlite3 from "sqlite3";

export const db = new sqlite3.Database(
  path.join(import.meta.dirname ?? "", "../daataabaasaa.db"),
);

db.exec(`
        CREATE TABLE IF NOT EXISTS infections (
        infector_id TEXT PRIMARY KEY,
        infected_id TEXT KEY
        )
    `);
