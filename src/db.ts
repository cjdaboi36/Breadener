import { Database } from "@db/sqlite";
import { env } from "./env.ts";
import { addSigListener } from "./sighandler.ts";

const basePath = new URL("../", import.meta.url);
export const db = new Database(
  new URL(basePath + env.DATABASE_PATH),
);

const closeListener = (): void => {
  console.log("Closing DB");
  db.close();
};

addSigListener(closeListener);

db.sql`
  CREATE TABLE IF NOT EXISTS infections (
  infectedId TEXT PRIMARY KEY,
  infectorId TEXT KEY
  )
`;
