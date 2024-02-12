import { eq } from 'drizzle-orm';
import { pgEnum } from 'drizzle-orm/pg-core';

import { db } from '..';
import { users, User, NewUser } from './user.schema';
import isEmail from 'validator/lib/isEmail';
import AppError from '../../utils/appError';

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
  const [newUser]: NewUser[] = await db
    .insert(users)
    .values({ username, email, password })
    .returning();

  return newUser;
}

/**
 * Filters the desired fields to update
 * Safely updates the user that is logged in
 * @param userId
 * @param updatedFieldsObject
 */
export async function updateEndUser(
  userId: string,
  updatedFieldsObject: Partial<User>
): Promise<Partial<User>[]> {
  const allowedFields = [];
  // username email password
  const filteredUpdatedFields = updatedFieldsObject;

  return db
    .update(users)
    .set(filteredUpdatedFields)
    .where(eq(users.id, userId))
    .returning();
}

export async function deleteEndUser(userId: string) {
  return await db
    .update(users)
    .set({
      active: false,
      profilePicture: 'default.png',
      role: 'user',
    })
    .where(eq(users.id, userId));
}
