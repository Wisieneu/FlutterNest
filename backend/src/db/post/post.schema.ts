import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import {
  boolean,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from '../user/user.schema';
import postConfig from './post.config';

// Post Schema
/**
 * TODO: relations
 * likes
 * reposts
 * dynamic typing, everything is a post
 */
export const typeEnum = pgEnum('type', postConfig.postTypes);

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: typeEnum('type').default('post').notNull(),
  textContent: varchar('textContent', {
    length: postConfig.maxTextContentLength,
  }),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt'),
  authorId: uuid('authorId').notNull(),
  parentId: uuid('parentId'),
  isDeleted: boolean('isDeleted').default(false).notNull(),
  // images:
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
    relationName: 'author',
  }),
  parentPost: one(posts, {
    fields: [posts.parentId],
    references: [posts.id],
    relationName: 'parentPost',
  }),
  childPosts: many(posts),
}));

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

export const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  userId: uuid('userId').notNull(),
  postId: uuid('postId').notNull(),
});

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
}));

export type Like = InferSelectModel<typeof likes>;
export type NewLike = InferInsertModel<typeof likes>;
