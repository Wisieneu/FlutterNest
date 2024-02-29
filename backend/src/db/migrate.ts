import { Pool } from 'pg';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { db, connection } from '.';

import logger from '../utils/logger';

async function main() {
  // const pool = new Pool({ connectionString: process.env.DB_URL });
  // const db: NodePgDatabase = drizzle(pool);

  logger.info('[migrate] Running migrations...');
  await migrate(db, { migrationsFolder: 'src/db/drizzle' });
  logger.info('[migrate] All migrations have been ran, exiting...');

  await connection.end();
}

main();
