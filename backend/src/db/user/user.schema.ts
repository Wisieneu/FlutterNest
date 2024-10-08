import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  timestamp,
  uuid,
  date,
  boolean,
  pgEnum,
  numeric,
} from "drizzle-orm/pg-core";

import userConfig, { roleType } from "./user.config";
import { posts } from "../post/post.schema";

// User Schema
/**
 * TODO: relations
 * list all liked posts
 * list all reposted posts
 * user following
 */
export const roleEnum = pgEnum("role", userConfig.roleTypes);

export const users = pgTable("users", {
  // Essential
  id: uuid("id").defaultRandom().primaryKey().notNull(),

  username: varchar("username", { length: userConfig.maxUsernameLength })
    .notNull()
    .unique(),
  displayName: varchar("displayName", {
    length: userConfig.maxUsernameLength,
  }).notNull(),

  email: varchar("email", { length: userConfig.maxEmailLength })
    .notNull()
    .unique(),

  password: varchar("password", {
    length: userConfig.maxPasswordLength,
  }).notNull(),

  // User info
  bio: varchar("bio", { length: userConfig.maxBioLength }).default(
    "No bio added."
  ),
  website: varchar("website", { length: userConfig.maxWebsiteLinkLength }),
  location: varchar("location", { length: userConfig.maxLocationLength }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  birthDate: date("birthDate"),
  profilePicture: varchar("profilePicture")
    .default(userConfig.defaultProfilePicture)
    .notNull(),

  // Security
  role: roleEnum("role").default("user").notNull(),
  lastPasswordChangeDate: timestamp("lastPasswordChangeDate", {
    precision: 4,
  }),
  passwordResetToken: varchar("passwordResetToken"),
  passwordResetExpires: date("passwordResetExpires"),

  fileStorageOccupied: numeric("fileStorageOccupied").default("0").notNull(),

  active: boolean("active").default(true).notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  // Posts
  posts: many(posts),
  likedPosts: many(posts),
  bookmarkedPosts: many(posts),

  // // Other users
  // following: many(users),
  // followers: many(users),
}));

type SensitiveFields =
  | "fileStorageOccupied"
  | "passwordResetExpires"
  | "passwordResetToken"
  | "lastPasswordChangeDate"
  | "password"
  | "email";

export type User = Omit<InferSelectModel<typeof users>, SensitiveFields>;
export type UserUnsafe = InferSelectModel<typeof users>;
export type PreviewUser = {
  id: string;
  username: string;
  displayName: string;
  profilePicture: string;
  createdAt: Date;
  role: roleType;
};
export type SettingsUser = Omit<
  InferSelectModel<typeof users>,
  "passwordResetToken" | "passwordResetExpires" | "password"
>;
export type NewUser = InferInsertModel<typeof users>;

export const previewUserBody = {
  id: users.id,
  username: users.username,
  displayName: users.displayName,
  profilePicture: users.profilePicture,
  createdAt: users.createdAt,
  role: users.role,
};

export const authorUserBody = {
  ...previewUserBody,
  active: users.active,
  birthDate: users.birthDate,
  bio: users.bio,
  website: users.website,
  location: users.location,
};
