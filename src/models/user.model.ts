import { InferModel } from 'drizzle-orm';
import {
  pgEnum,
  pgTable,
  serial,
  text,
  boolean,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core';

// declaring enum in database
export const userRoleEnum = pgEnum('userRole', ['user', 'admin']);

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    nickname: varchar('nickname', { length: 20 }),
    email: text('email'),
    active: boolean('active').default(true),
    role: varchar('role', { enum: ['user', 'admin'] }).default('user'),
    password: varchar('password', { length: 64 }),
    passwordLastChanged: timestamp('passwordLastChanged'),
  },
  // (countries) => {
  //   return {
  //     nameIndex: uniqueIndex('name_idx').on(user.nickname),
  //   };
  // },
);

export type userType = InferModel<typeof users, 'select'>;
export type newUserType = InferModel<typeof users, 'insert'>;

// export const User: userType =
