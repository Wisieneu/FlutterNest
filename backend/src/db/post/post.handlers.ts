import { and, desc, eq, inArray, or, sql } from "drizzle-orm";

import { db } from "..";
import { likes, Post, posts } from "./post.schema";
import { users } from "../user/user.schema";
import { postMediaFiles } from "../postMediaFiles/post.media.files.schema";

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
  media: postMediaFiles,
};

const postIsNotDeleted = eq(posts.isDeleted, false);

/**
 * Prepared queries for the schema handlers below to use
 */
const getPostsPaginatedQuery = db.query.posts
  .findMany({
    with: {
      author: {
        columns: {
          id: true,
          username: true,
          displayName: true,
          profilePicture: true,
          role: true,
          active: true,
          createdAt: true,
          birthDate: true,
        },
      },
      media: true,
    },
    limit: sql.placeholder("limit"),
    offset: Number(sql.placeholder("page")) * 10,
    where: postIsNotDeleted,
    orderBy: desc(posts.createdAt),
  })
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

const getPostByIdQuery = db.query.posts
  .findFirst({
    with: {
      author: {
        columns: {
          id: true,
          username: true,
          displayName: true,
          profilePicture: true,
          role: true,
          active: true,
        },
      },
      media: true,
    },
    where: eq(posts.id, sql.placeholder("postId")),
  })
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
  const result = await getPostsPaginatedQuery.execute({ page, limit });
  // const postIds = result.map((post) => post.id);
  // console.log(postIds);
  // const files = await db
  //   .select()
  //   .from(postMediaFiles)
  //   .where(inArray(postMediaFiles.postId, postIds));
  // // .groupBy(postMediaFiles.postId);
  // console.log(files);

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
