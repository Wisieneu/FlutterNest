import { and, desc, eq, getTableColumns, SQL, sql } from "drizzle-orm";

import { db } from "..";
import { likes, Post, posts } from "./post.schema";
import { users } from "../user/user.schema";
import { PostType } from "./post.config";
import * as postMediaHandler from "../postMediaFiles/post.media.files.handlers";
import placeholderUser from "../user/placeholder.user";

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
    bio: users.bio,
    website: users.website,
    location: users.location,
  },
  likesAmount: posts.likesAmount,
  commentsAmount: posts.commentsAmount,
  bookmarksAmount: posts.bookmarksAmount,
  viewsAmount: posts.viewsAmount,
  authorId: posts.authorId,
};

const {
  password,
  lastPasswordChangeDate,
  passwordResetExpires,
  passwordResetToken,
  email,
  fileStorageOccupied,
  ...nonSensitiveColumns
} = getTableColumns(users);

let safeUserColumns: { [key: string]: any } = {}; // TODO: typesafe this somehow:)
Object.keys(nonSensitiveColumns).forEach(
  (col) => (safeUserColumns[col] = true)
);

const postIsNotDeleted = eq(posts.isDeleted, false);

/**
 * Prepared queries for the schema handlers below to use
 */
const getPostsPaginatedQuery = db.query.posts
  .findMany({
    with: {
      author: {
        columns: safeUserColumns,
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
        columns: safeUserColumns,
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
  .prepare("getPostCommentsPaginatedQuery");

const getCommentCountByPostIdQuery = db
  .select({ commentCount: sql.raw("COUNT(*) as commentCount") })
  .from(posts)
  .where(and(postIsNotDeleted, eq(posts.parentId, sql.placeholder("postId"))))
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
        columns: safeUserColumns,
      },
      media: true,
    },
    where: and(postIsNotDeleted, eq(posts.id, sql.placeholder("postId"))),
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
  .returning()
  .prepare("likePostDbQuery");

const unlikePostDbQuery = db
  .delete(likes)
  .where(
    and(
      eq(likes.postId, sql.placeholder("postId")),
      eq(likes.userId, sql.placeholder("userId"))
    )
  )
  .returning()
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

  result.forEach((post) =>
    !post.author ? (post.author = placeholderUser) : post.author
  );

  return result as Post[];
}

export async function getPostById(postId: string) {
  const result = (await getPostByIdQuery.execute({ postId })) as Post;
  if (!result.author) result.author = placeholderUser;
  return result;
}

/**
 * Get posts created by a certain user
 * currently uses an alternative way of querying the database
 * because findMany is not the way I want to go
 * TODO: compare how effective it is in comparison to the db.query.posts.findMany
 *
 * @param {string} userId id of user whose posts will be searched
 * @param @enum {PostType} type post type to search for
 * @param {number} page pagination page (skips the first <page * objectsPerPage> posts)
 * @param {number} objectsPerPage number of posts to return per page
 * @returns array of posts
 */
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
        eq(posts.type, type),
        eq(posts.authorId, userId),
        eq(posts.type, type),
        postIsNotDeleted
      ) // asdasdas
    )
    .leftJoin(users, eq(posts.authorId, users.id))
    .orderBy(desc(posts.createdAt))
    .offset((page - 1) * objectsPerPage)
    .limit(objectsPerPage);

  const result: Post[] =
    await postMediaHandler.populatePostObjectsWithMediaFilesManually(postsPage);

  return result;
}

/**
 * Gets "comment" type posts of a certain post
 *
 * @param postId parentId of the post whose comments will be searched
 * @param page pagination page (skips the first <page * objectsPerPage> comments)
 * @param objectsPerPage number of comments to return per page
 * @returns paginated array of comments and the total number of comments on that post
 */
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

/**
 *
 * @param authorId id of the user who will create the post
 * @param textContent text content of the post
 * @param postType @enum {PostType} type of the post
 * @param parentId optional - id of the parent post (if it is a comment or repost)
 * @returns the newly created post
 */
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

/**
 * Creates a like entry, increments the likesAmount of the post and returns the like
 * @param postId id of the post to like
 * @param userId id of the user who will like the post
 * @returns like object
 */
export async function likePost(postId: string, userId: string) {
  const like = await likePostDbQuery.execute({ postId, userId });
  await db
    .update(posts)
    .set({ likesAmount: sql.raw("likesAmount + 1") })
    .where(and(eq(posts.id, postId)))
    .returning();
  return like;
}

/**
 * Deletes the like entry, decrements the likesAmount of the post
 * @param postId id of the post to like
 * @param userId id of the user who will like the post
 */
export async function unlikePost(postId: string, userId: string) {
  const like = await unlikePostDbQuery.execute({ postId, userId });
  await db
    .update(posts)
    .set({ likesAmount: sql.raw("likesAmount - 1") })
    .where(and(eq(posts.id, postId)))
    .returning();
  return like;
}
