import isEmail from "validator/lib/isEmail";
import { db, connection } from "..";
import logger from "../../utils/logger";
import { users } from "../user/user.schema";
import userConfig from "../user/user.config";
import { signUpEndUser } from "../user/user.handlers";
import { eq } from "drizzle-orm";

/**
 * This script is used for development purposes
 * It is not meant to be used in production
 * It is meant to be used for testing and debugging purposes
 * Just comment out the lines you don't need
 */
async function main() {
  logger.info("Starting...");

  const creds = process.argv.slice(2);
  let name: string;
  let email: string;
  let password: string;

  creds.forEach(async (cred) => {
    if (cred.startsWith("--name=")) {
      name = cred.split("=")[1];
    } else if (cred.startsWith("--email=")) {
      email = cred.split("=")[1];
    } else if (cred.startsWith("--password=")) {
      password = cred.split("=")[1];
    }
  });

  console.log(name, email, password);
  if (!name || !email || !password) {
    throw new Error(
      "Usage: createadmin --name=<ADMIN_USERNAME> --email=<ADMIN_EMAIL> --password=<ADMIN_PASSWORD>"
    );
  }
  if (!isEmail(email)) throw new Error("Invalid email");
  if (
    password.length < userConfig.minPasswordLength ||
    password.length > userConfig.maxPasswordLength
  )
    throw new Error(
      `Password must be ${userConfig.minPasswordLength}-${userConfig.maxPasswordLength} characters long`
    );

  const user = await signUpEndUser(password, name, email);
  const admin = db
    .update(users)
    .set({ role: "admin" })
    .where(eq(users.id, user.id))
    .returning();

  console.info("Your admin account:");
  console.log(admin);
  await connection.end();
}

main();
