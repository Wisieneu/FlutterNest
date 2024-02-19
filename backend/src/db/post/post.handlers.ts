import { and, eq, sql } from 'drizzle-orm';
import { db } from '..';
import { likes, posts } from './post.schema';

export const getPostById = db
  .select()
  .from(posts)
  .where(eq(posts.id, sql.placeholder('postId')))
  .prepare('getPostById');

export const getLikesByPostId = db
  .select()
  .from(likes)
  .where(eq(likes.postId, sql.placeholder('postId')))
  .prepare('getLikesByPostId');

export const findLike = db
  .select()
  .from(likes)
  .where(
    and(
      eq(likes.postId, sql.placeholder('postId')),
      eq(likes.userId, sql.placeholder('userId'))
    )
  )
  .prepare('findLike');
