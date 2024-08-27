import { and, eq, getTableColumns } from "drizzle-orm";
import bcrypt from "bcrypt";

import { db } from "..";
import { users, User, NewUser, UserUnsafe } from "./user.schema";

// Define columns that are safe to expose to other end users
const {
  password,
  lastPasswordChangeDate,
  passwordResetExpires,
  passwordResetToken,
  email,
  fileStorageOccupied,
  ...nonSensitiveColumns
} = getTableColumns(users);

/**
 * Filters the user object for it to only include
 * the columns that are not sensitive to expose
 * Note: a separate function is needed because Drizzle does not
 * have a built-in filter functionality
 * @param {User} userObj
 * @returns {Partial<User>} the user object without sensitive
 */
export function filterUserObj(userObj: UserUnsafe): User {
  userObj.password = undefined!;
  userObj.email = undefined!;
  userObj.active = undefined!;
  userObj.lastPasswordChangeDate = undefined!;
  userObj.passwordResetToken = undefined!;
  userObj.passwordResetExpires = undefined!;
  return userObj;
}

const userIsNotInactive = eq(users.active, true);

// Functions responsible for manipulating the user model
/**
 * Sign up a new end user.
 *
 * @param {string} password
 * @param {string} username
 * @param {string} email
 * @returns {Promise<NewUser>} - A promise that resolves with the newly created user.
 */
export async function signUpEndUser(
  password: string,
  username: string,
  email: string
): Promise<NewUser> {
  const hashedPassword = await bcrypt.hash(password, 12);

  const [newUser]: NewUser[] = await db
    .insert(users)
    .values({
      username,
      email,
      password: hashedPassword,
      displayName: username,
    })
    .returning();

  return newUser;
}

/**
 * Retrieves an end user from the database based on the provided username.
 *
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<User>} - the queried user
 */
export async function getEndUserByUsername(username: string): Promise<User> {
  const [user]: User[] = await db
    .select({ ...nonSensitiveColumns })
    .from(users)
    .where(and(eq(users.username, username), userIsNotInactive));

  return user;
}

export async function getEndUserById(userId: string): Promise<User> {
  const [user]: User[] = await db
    .select({ ...nonSensitiveColumns })
    .from(users)
    .where(and(eq(users.id, userId), userIsNotInactive));

  return user;
}

/**
 * Filters the desired fields to update
 * Safely updates the user that is logged in
 * @param userId
 * @param updatedFieldsObject - the fields to update
 */
export async function updateEndUser(
  userId: string,
  fieldsToUpdateObj: UserUnsafe
): Promise<Partial<UserUnsafe>> {
  const filteredUpdateFields = filterUserObj(fieldsToUpdateObj);

  //TODO: update users
  const [result]: Partial<UserUnsafe>[] = await db
    .update(users)
    .set(filteredUpdateFields)
    .where(eq(users.id, userId))
    .returning({ ...nonSensitiveColumns, email: users.email });
  return result;
}

export async function deactivateEndUser(user: User) {
  const [deactivatedUser]: User[] = await db
    .update(users)
    .set({
      active: false,
      profilePicture: "default.png",
      role: "user",
    })
    .where(eq(users.id, user.id))
    .returning(nonSensitiveColumns);

  return deactivatedUser;
}
