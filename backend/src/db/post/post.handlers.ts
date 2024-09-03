import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  inArray,
  SQL,
  sql,
} from "drizzle-orm";

import { db } from "..";
import { bookmarks, ExposedPost, likes, Post, posts } from "./post.schema";
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
    profilePicture: users.profilePicture,
    role: users.role,
    active: users.active,
    createdAt: users.createdAt,
    birthDate: users.birthDate,
    bio: users.bio,
    website: users.website,
    location: users.location,
  },
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

export async function getPostsPaginatedQuery(
  queryStatement: SQL<unknown> | undefined,
  page: number,
  objectsPerPage: number,
  userId?: string
): Promise<ExposedPost[]> {
  let result = await db
    .select(postBody)
    .from(posts)
    .where(queryStatement)
    .leftJoin(users, eq(posts.authorId, users.id))
    .offset((page - 1) * objectsPerPage)
    .limit(objectsPerPage)
    .orderBy(desc(posts.createdAt));

  const resultWithMedia =
    await postMediaHandler.populatePostObjectsWithMediaFilesManually(result);

  const resultWithMediaAndInteractions =
    await popuatePostObjectsWithInteractionsData(resultWithMedia, userId);

  return resultWithMediaAndInteractions;
}

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
  .orderBy(desc(likes.createdAt))
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

/**
 *
 * @param postIdsArray array of post IDs to search likes for
 * @returns { {count: number; postId: string; }[] } array of amount of likes for each post
 */
const getPostsLikesAmounts = async (
  postIdsArray: string[]
): Promise<{ count: number; postId: string }[]> =>
  await db
    .select({
      count: count(),
      postId: likes.postId,
    })
    .from(likes)
    .where(inArray(likes.postId, postIdsArray))
    .groupBy(likes.postId);

const checkPostsUserLikeStatus = async (
  postIdsArray: string[],
  userId: string
): Promise<{ postId: string }[]> =>
  await db
    .select({ postId: likes.postId })
    .from(likes)
    .where(and(inArray(likes.postId, postIdsArray), eq(likes.userId, userId)));

const getPostsCommentsAmounts = async (
  postIdsArray: string[]
): Promise<{ count: number; postId: string | null }[]> =>
  await db
    .select({
      count: count(),
      postId: posts.parentId,
    })
    .from(posts)
    .where(
      and(
        eq(posts.type, "comment"),
        inArray(posts.parentId, postIdsArray),
        postIsNotDeleted
      )
    )
    .groupBy(posts.parentId);

const getPostsBookmarksAmounts = async (
  postIdsArray: string[]
): Promise<{ count: number; postId: string }[]> =>
  await db
    .select({
      count: count(),
      postId: bookmarks.postId,
    })
    .from(bookmarks)
    .where(inArray(bookmarks.postId, postIdsArray))
    .groupBy(bookmarks.postId);

/**
 * Populates all of the posts with:
 * - the amount of likes they have
 * - the amount of comments they have
 * - the amount of bookmarks that has been created for them
 * - whether the user has liked the post or not
 *
 * @param postsArray IDs of the posts to populate
 * @param userId ID of the user who is viewing the posts
 * @returns array of posts with the interactions data populated
 */
export async function popuatePostObjectsWithInteractionsData(
  postsArray: Post[],
  userId: string | undefined
): Promise<ExposedPost[]> {
  const postIdsArray = postsArray.map((post) => post.id);
  const likesAmountArray = await getPostsLikesAmounts(postIdsArray);
  const commentsAmountArray = await getPostsCommentsAmounts(postIdsArray);
  const bookmarksAmountArray = await getPostsBookmarksAmounts(postIdsArray);
  let isLikedArray: { postId: string }[] | null;
  if (userId)
    isLikedArray = await checkPostsUserLikeStatus(postIdsArray, userId);

  return postsArray.map((post) => ({
    ...post,
    // Populate every post with the amount of likes it has
    likesAmount:
      likesAmountArray.find((el) => el.postId === post.id)?.count || 0,
    // Populate every post with the amount of comments created for it
    commentsAmount:
      commentsAmountArray.find((el) => el.postId === post.id)?.count || 0,
    // ...with amount of bookmarks users have created for it
    bookmarksAmount:
      bookmarksAmountArray.find((el) => el.postId === post.id)?.count || 0,
    // ...with whether the user has liked the post or not
    isLikedByCurrentUser: isLikedArray
      ? isLikedArray.map((el) => el.postId).includes(post.id)
      : false,
  }));
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
export async function getPostById(postId: string) {
  const result = await getPostByIdQuery.execute({ postId });
  if (!result!.author) result!.author = placeholderUser;
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
      )
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
  return like;
}

/**
 * Deletes the like entry, decrements the likesAmount of the post
 * @param postId id of the post to like
 * @param userId id of the user who will like the post
 */
export async function unlikePost(postId: string, userId: string) {
  const like = await unlikePostDbQuery.execute({ postId, userId });
  return like;
}
