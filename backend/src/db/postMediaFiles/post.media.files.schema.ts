import {
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

import { users } from "../user/user.schema";
import { posts } from "../post/post.schema";

export const postMediaFiles = pgTable("postMediaFiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  authorId: uuid("authorId").notNull(),
  postId: uuid("postId").notNull(),
  fileName: varchar("fileName", { length: 128 }).notNull(),
  mimetype: varchar("mimetype", { length: 128 }).notNull(),
  fileSize: numeric("fileSize").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const postMediaFilesRelations = relations(postMediaFiles, ({ one }) => ({
  author: one(users, {
    fields: [postMediaFiles.authorId],
    references: [users.id],
    relationName: "author",
  }),
  parentPost: one(posts, {
    fields: [postMediaFiles.postId],
    references: [posts.id],
    relationName: "postMedia",
  }),
}));

export type PostMediaFile = InferSelectModel<typeof postMediaFiles>;
export type NewPostMediaFile = InferInsertModel<typeof postMediaFiles>;
