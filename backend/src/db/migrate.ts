import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, connection } from ".";

import logger from "../utils/logger";

async function main() {
  // const pool = new Pool({ connectionString: process.env.DB_URL });
  // const db: NodePgDatabase = drizzle(pool);

  logger.info("[migrate] Running migrations...");
  try {
    await migrate(db, { migrationsFolder: "src/db/drizzle" });
    logger.info("[migrate] All migrations have been ran, exiting...");
  } catch (err) {
    logger.error("[migrate] Migration failed", err);
  }

  await connection.end();
}

main();
