import { Database } from "@db/sqlite";
import { env } from "./config.ts";
import { addSigListener } from "./sighandler.ts";

const basePath: URL = new URL("../", import.meta.url);
const path: URL = new URL(env.DATABASE_PATH, basePath);
export const db: Database = new Database(path);

const closeListener = (): void => {
  console.log("Closing DB");
  db.close();
};
addSigListener(closeListener);

db.exec(`
        CREATE TABLE IF NOT EXISTS infections (
        infectedId TEXT PRIMARY KEY,
        infectorId TEXT KEY
        )
    `);
