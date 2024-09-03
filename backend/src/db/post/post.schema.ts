import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { User, users } from "../user/user.schema";
import postConfig from "./post.config";
import {
  PostMediaFile,
  postMediaFiles,
} from "../postMediaFiles/post.media.files.schema";

/**
 * POST SCHEMA
 */
export const typeEnum = pgEnum("type", postConfig.postTypes);

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: typeEnum("type").default("post").notNull(),
  textContent: varchar("textContent", {
    length: postConfig.maxTextContentLength,
  }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt"),
  authorId: uuid("authorId").notNull(),
  parentId: uuid("parentId"),
  isDeleted: boolean("isDeleted").default(false).notNull(),
  viewsAmount: integer("viewsAmount").default(0).notNull(),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
    relationName: "author",
  }),
  parentPost: one(posts, {
    fields: [posts.parentId],
    references: [posts.id],
    relationName: "parentPost",
  }),
  media: many(postMediaFiles, {
    relationName: "postMedia",
  }),
}));

// Post after populating it with the author field
export type Post = InferSelectModel<typeof posts> & {
  author: User | null;
};

// Post after populating it with all of the fields needed for frontend
export type ExposedPost = Post & {
  likesAmount: number;
  commentsAmount: number;
  bookmarksAmount: number;
  isLikedByCurrentUser: boolean;
  media?: PostMediaFile[];
};
export type NewPost = InferInsertModel<typeof posts>;

/**
 * LIKE SCHEMA
 */
export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  userId: uuid("userId").notNull(),
  postId: uuid("postId").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
    relationName: "likeAuthor",
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
    relationName: "likedPost",
  }),
}));

export type Like = InferSelectModel<typeof likes>;
export type NewLike = InferInsertModel<typeof likes>;

/**
 * BOOKMARK SCHEMA
 */
export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: uuid("userId").notNull(),
  postId: uuid("postId").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
    relationName: "bookmarkAuthor",
  }),
  post: one(posts, {
    fields: [bookmarks.postId],
    references: [posts.id],
    relationName: "bookmarkedPost",
  }),
}));

export type Bookmark = InferSelectModel<typeof bookmarks>;
export type NewBookmark = InferInsertModel<typeof bookmarks>;
