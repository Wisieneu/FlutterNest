import { and, desc, eq, SQL, sql } from "drizzle-orm";

import { db } from "..";
import { likes, Post, posts } from "./post.schema";
import { users } from "../user/user.schema";
import { PostType } from "./post.config";
import * as postMediaHandler from "../postMediaFiles/post.media.files.handlers";

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
    active: users.active,
  },
  likesAmount: posts.likesAmount,
  commentsAmount: posts.commentsAmount,
  bookmarksAmount: posts.bookmarksAmount,
  viewsAmount: posts.viewsAmount,
  authorId: posts.authorId,
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
    offset: sql.placeholder("offset"),
    limit: sql.placeholder("limit"),
    where: and(postIsNotDeleted, eq(posts.type, "post")),
    orderBy: desc(posts.createdAt),
  })
  .prepare("getPostsPaginatedQuery");

const getPostCommentsPaginatedQuery = db.query.posts
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
    offset: sql.placeholder("offset"),
    limit: sql.placeholder("limit"),
    where: and(
      postIsNotDeleted,
      eq(posts.parentId, sql.placeholder("postId")),
      eq(posts.type, "comment")
    ),
    orderBy: desc(posts.createdAt),
  })
  .prepare("getPostsPaginatedQuery");

const getCommentCountByPostIdQuery = db
  .select({ commentCount: sql.raw("COUNT(*) as commentCount") })
  .from(posts)
  .where(and(eq(posts.parentId, sql.placeholder("postId")), postIsNotDeleted))
  .prepare("getCommentCountByPostIdQuery");

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
    where: and(eq(posts.id, sql.placeholder("postId")), postIsNotDeleted),
  })
  .prepare("getPostByIdQuery");

async function getPostsPaginatedQuery2(
  queryStatement: SQL,
  page: number,
  objectsPerPage: number
) {
  const result = await db
    .select(postBody)
    .from(posts)
    .where(queryStatement)
    .offset((page - 1) * objectsPerPage)
    .limit(objectsPerPage);

  return result;
}

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
export async function getPostsPaginated(page: number, objectsPerPage: number) {
  const offset = (page - 1) * objectsPerPage;
  const result = await getPostsPaginatedQuery.execute({
    offset,
    limit: objectsPerPage,
  });
  return result;
}

export async function getPostById(postId: string) {
  const result = await getPostByIdQuery.execute({ postId });
  return result;
}

export async function getPostsByUserIdPaginated(
  userId: string,
  type: PostType,
  page: number,
  objectsPerPage: number
): Promise<Post[]> {
  const postsPage = await db
    .select(postBody)
    .from(posts)
    .where(
      and(
        eq(posts.isDeleted, false),
        eq(posts.type, type),
        eq(posts.authorId, userId)
      )
    )
    .leftJoin(users, eq(posts.authorId, users.id))
    .orderBy(desc(posts.createdAt))
    .offset((page - 1) * objectsPerPage)
    .limit(objectsPerPage);

  const result =
    await postMediaHandler.populatePostObjectWithMediaFilesManually(postsPage);

  return result;
}

export async function getPostCommentsPaginated(
  postId: string,
  page: number,
  objectsPerPage: number
) {
  const offset = (page - 1) * objectsPerPage;
  const result = await getPostCommentsPaginatedQuery.execute({
    offset,
    limit: objectsPerPage,
    postId,
  });
  const [commentCount] = await getCommentCountByPostIdQuery.execute({
    postId,
  });
  return { result, commentCount: commentCount };
}

export async function insertPost(
  authorId: string,
  textContent: string,
  postType: PostType,
  parentId?: string
) {
  const [newPost] = await db
    .insert(posts)
    .values({
      authorId,
      type: postType,
      textContent,
      parentId: parentId ? parentId : null,
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
