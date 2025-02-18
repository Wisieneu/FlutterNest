import { and, desc, eq, getTableColumns } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { db } from "..";
import {
  users,
  User,
  NewUser,
  UserUnsafe,
  SettingsUser,
  PreviewUser,
  previewUserBody,
} from "./user.schema";
import userConfig from "./user.config";

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
  userObj.fileStorageOccupied = undefined!;
  userObj.profilePicture = undefined!;
  userObj.role = undefined!;
  userObj.createdAt = undefined!;
  userObj.id = undefined!;
  userObj.username = undefined!;
  return userObj;
}

export function validatePassword(password: string): boolean {
  return (
    password.length >= userConfig.minPasswordLength &&
    password.length <= userConfig.maxPasswordLength
  );
}

const userIsNotInactive = eq(users.active, true);

/**
 * Functions responsible for manipulating the user model
 */

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

export async function getEndUserSettingsData(
  userId: string
): Promise<UserUnsafe> {
  const [user]: UserUnsafe[] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));
  return user;
}

export async function getEndUserById(userId: string): Promise<User> {
  const [user]: User[] = await db
    .select({ ...nonSensitiveColumns })
    .from(users)
    .where(and(eq(users.id, userId), userIsNotInactive));

  return user;
}

export async function getNewcomerUsers(limit: number): Promise<PreviewUser[]> {
  const usersArray = await db
    .select(previewUserBody)
    .from(users)
    .where(userIsNotInactive)
    .orderBy(desc(users.createdAt))
    .limit(limit);

  return usersArray;
}

/**
 * Filters the desired fields to update
 * Safely updates the user that is logged in
 * @param userId
 * @param updatedFieldsObject - the fields to update
 */
export async function updateEndUser(
  userId: string,
  fieldsToUpdateObj: Partial<SettingsUser>
): Promise<Partial<UserUnsafe>> {
  const [result]: Partial<UserUnsafe>[] = await db
    .update(users)
    .set(fieldsToUpdateObj)
    .where(eq(users.id, userId))
    .returning({ ...nonSensitiveColumns, email: users.email });
  return result;
}

export async function updateUserPassword(
  userId: string,
  newPassword: string
): Promise<Partial<UserUnsafe>> {
  if (validatePassword(newPassword) === false)
    throw new Error("Password must be at least 8 characters long.");
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const [result]: Partial<UserUnsafe>[] = await db
    .update(users)
    .set({
      password: hashedPassword,
      lastPasswordChangeDate: new Date(),
    })
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
