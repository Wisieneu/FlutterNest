import isEmail from "validator/lib/isEmail";
import { db, connection } from "../db";
import logger from "../utils/logger";
import { users } from "../db/user/user.schema";
import userConfig from "../db/user/user.config";
import { signUpEndUser } from "../db/user/user.handlers";
import { createInterface } from "readline";
import { eq } from "drizzle-orm";

/**
 * This script is used for development purposes
 * It is not meant to be used in production
 * It is meant to be used for testing and debugging purposes
 * Just comment out the lines you don't need
 */

async function main() {
  logger.info("Starting...");
  const inputs: string[] = [];

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter new admin's username: ", (username) => {
    rl.question("Enter new admin's email: ", (email) => {
      rl.question("Finally, enter the admin's password: ", (password) => {
        if (!username || !email || !password) {
          throw new Error("One or more fields are missing. Please try again.");
        }
        if (!isEmail(email)) throw new Error("Invalid email");
        if (
          password.length < userConfig.minPasswordLength ||
          password.length > userConfig.maxPasswordLength
        )
          throw new Error(
            `Password must be ${userConfig.minPasswordLength}-${userConfig.maxPasswordLength} characters long`
          );
        inputs.push(password, username, email);
        rl.close();
      });
    });
  });
  rl.on("close", async () => {
    const user = await signUpEndUser(inputs[0], inputs[1], inputs[2]);
    const [admin] = await db
      .update(users)
      .set({ role: "admin" })
      .where(eq(users.id, user.id!))
      .returning();

    console.info("Your admin account:");
    console.info(admin);
    await connection.end();
  });
}

main();
