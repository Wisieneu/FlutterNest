import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

const drizzleDatabaseConnection = () => {
  const connectionString = process.env.POSTGRES_CONNECT_STRING as string;
  const db = new pg.Client({
    connectionString,
    ssl: {
      rejectUnauthorized: true,
    },
  });

  db.connect()
    .then(() => {
      console.log(
        `✅ PostgreSQL '${db.database}' database connection has been established successfully.`,
      );
    })
    .catch((err: any) => {
      console.log(
        `❌ Unable to connect to the PostgreSQL ${db.database} database. ${err}`,
      );
    });

  db.on('error', () => {
    console.log();
  });

  return drizzle(db);
};

export default drizzleDatabaseConnection;
