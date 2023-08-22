import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import 'dotenv';

const pool = new pg.Client({
  connectionString: process.env.POSTGRES_CONNECT_STRING,
});

const db = drizzle(pool);

async function main() {
  console.log('Migration in progress...');
  await migrate(db, { migrationsFolder: 'drizzle' });
  console.log('Migration ended.');
  // process.exit(0);
}

main().catch((err) => {
  console.log(err);
  console.log('dsad');
  // process.exit(0);
});
