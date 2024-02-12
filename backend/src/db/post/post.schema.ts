import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import {
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
 *
 */
export const typeEnum = pgEnum('type', postConfig.postTypes);

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: typeEnum('type').default('post').notNull(),
  content: varchar('content', {
    length: postConfig.maxContentLength,
  }).notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt'),
  authorId: uuid('authorId').notNull(),
  // images:
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  // parentId: one(posts),
}));

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

// export const likes = pgTable('likes', {
//   id: serial('id').primaryKey(),
//   userId: uuid('userId'),
//   postId: uuid('postId'),
// });

// export const reposts = pgTable('reposts', {
//   id: serial('id').primaryKey(),
//   userId: uuid('userId'),
//   postId: uuid('postId'),
// });
