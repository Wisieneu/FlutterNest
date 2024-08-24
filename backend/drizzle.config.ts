import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: [
    "./src/db/post/post.schema.ts",
    "./src/db/user/user.schema.ts",
    "./src/db/postMediaFiles/post.media.files.schema.ts",
  ],
  out: "./src/db/drizzle",
  dialect: "postgresql",
  // dbCredentials: {
  //   connectionString: String(process.env.DB_URL),
  // },
  verbose: true,
  strict: true,
} satisfies Config;
