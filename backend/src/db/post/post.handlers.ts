import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "..";
import { likes, Post, posts } from "./post.schema";
import { users } from "../user/user.schema";

// Post columns for select query
const postBody = {
  id: posts.id,
  type: posts.type,
  textContent: posts.textContent,
  createdAt: posts.createdAt,
  updatedAt: posts.updatedAt,
  parentId: posts.parentId,
  isDeleted: posts.isDeleted,
  author: {
    id: users.id,
    username: users.username,
    displayName: users.displayName,
    createdAt: users.createdAt,
    birthDate: users.birthDate,
    profilePicture: users.profilePicture,
    role: users.role,
  },
  likesAmount: posts.likesAmount,
  commentsAmount: posts.commentsAmount,
};

const postIsNotDeleted = eq(posts.isDeleted, false);

/**
 * Prepared queries for the schema handlers below to use
 */
const getPostsPaginatedQuery = db
  .select(postBody)
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .where(eq(posts.isDeleted, false))
  .orderBy(desc(posts.createdAt))
  .limit(sql.placeholder("limit"))
  .offset(Number(sql.placeholder("page")) * 10)
  .prepare("getPostsPaginatedQuery");

const getLikesByPostId = db
  .select({
    likeId: likes.id,
    postId: likes.postId,
    username: users.username,
    displayName: users.displayName,
    profilePicture: users.profilePicture,
    userId: users.id,
  })
  .from(likes)
  .leftJoin(users, eq(likes.userId, users.id))
  .where(eq(likes.postId, sql.placeholder("postId")))
  .prepare("getLikesByPostId");

const getPostByIdQuery = db
  .select(postBody)
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .where(and(eq(posts.id, sql.placeholder("postId")), postIsNotDeleted))
  .prepare("getPostByIdQuery");

const findLikeQuery = db
  .select()
  .from(likes)
  .where(
    and(
      eq(likes.postId, sql.placeholder("postId")),
      eq(likes.userId, sql.placeholder("userId"))
    )
  )
  .prepare("findLikeQuery");

const likePostDbQuery = db
  .insert(likes)
  .values({
    userId: sql.placeholder("userId"),
    postId: sql.placeholder("postId"),
  })
  .prepare("likePostDbQuery");

const unlikePostDbQuery = db
  .delete(likes)
  .where(
    and(
      eq(likes.postId, sql.placeholder("postId")),
      eq(likes.userId, sql.placeholder("userId"))
    )
  )
  .prepare("unlikePostDbQuery");

/**
 * Functions for the post controller to use
 */
export async function getPostsPaginated(page: number, limit: number) {
  const result: Post[] = await getPostsPaginatedQuery.execute({ page, limit });
  return result;
}

export async function getPostById(postId: string) {
  const result = await getPostByIdQuery.execute({ postId });
  return result;
}

export async function getPostsByUserId(userId: string) {
  const postsData = await db
    .select()
    .from(posts)
    .where(and(eq(posts.authorId, userId), postIsNotDeleted))
    .execute();
  return postsData;
}

export async function insertPost(authorId: string, textContent: string) {
  const [newPost] = await db
    .insert(posts)
    .values({
      authorId,
      type: "post",
      textContent,
    })
    .returning();

  return newPost;
}

export async function findLike(userId: string, postId: string) {
  const like = await findLikeQuery.execute({ postId: postId, userId: userId });
  return like;
}

export async function likePost(postId: string, userId: string) {
  const like = await likePostDbQuery.execute({ postId, userId });
  return like;
}

export async function unlikePost(postId: string, userId: string) {
  const like = await unlikePostDbQuery.execute({ postId, userId });
  return like;
}
