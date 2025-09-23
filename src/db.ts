import { Database } from "@db/sqlite";
import { config } from "./config.ts";
import { addSigListener } from "./sighandler.ts";

const base_path = new URL("../", import.meta.url);
const path = new URL(config.DATABASE_PATH, base_path);
export const db = new Database(path);

const closeListener = () => {
  console.log("Closing DB");
  db.close();
};
addSigListener(closeListener);

db.exec(`
        CREATE TABLE IF NOT EXISTS infections (
        infector_id TEXT PRIMARY KEY,
        infected_id TEXT KEY
        )
    `);
