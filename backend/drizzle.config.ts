import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/*/*.schema.ts",
  out: "./src/db/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: String(process.env.DB_URL),
  },
  verbose: true,
  strict: true,
} satisfies Config;
