import { Pool } from "pg";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import "dotenv/config";

import * as postSchema from "./post/post.schema";
import * as userSchema from "./user/user.schema";
import * as postMediaFilesSchema from "./postMediaFiles/post.media.files.schema";

import logger from "../utils/logger";

function main() {
  if (
    !process.env.DB_HOST ||
    !process.env.DB_NAME ||
    !process.env.DB_USER ||
    !process.env.DB_PASSWORD
  ) {
    throw new Error("Database credentials missing.");
  }

  return new Pool({
    port: 5432,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: true,
  });
}

export let connection: Pool;
try {
  connection = main();
  logger.info("Database connection successful");
} catch (err) {
  logger.error(
    `An error has occurred while connecting to the database:\n${err}\nThe app will be shut down.`
  );
  process.exit(1);
}

const combinedSchemas = {
  ...postSchema,
  ...userSchema,
  ...postMediaFilesSchema,
};

export const db: NodePgDatabase<typeof combinedSchemas> = drizzle(connection, {
  schema: combinedSchemas,
});
