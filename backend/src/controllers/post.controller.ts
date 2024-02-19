import { NextFunction, Request, Response } from 'express';

import { db } from '../db';
import { Like, NewPost, Post, likes, posts } from '../db/post/post.schema';
import { and, eq } from 'drizzle-orm';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { findLike, getPostById } from '../db/post/post.handlers';
import { postType } from '../db/post/post.config';

export const getPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result: Post[] = await db.query.posts.findMany();

    return res.status(200).json({
      status: 'success',
      data: {
        result,
      },
    });
  }
);

export const getPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    const result = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });

    if (!result) {
      next(new AppError('Could not find a post with this ID', 404));
    }

    return res.status(200).json({
      status: 'success',
      data: {
        result,
      },
    });
  }
);

/**
 * Creates a new post
 *
 * TODO: attaching images
 * @param {postType} type - The type of the post (post, comment, repost).
 * @throws {AppError} - If there is an error creating the post.
 */
export const createPost = (type: postType) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user!.id;
    const { content } = req.body;

    let parentId = undefined;
    if (type !== 'post') {
      const { postId } = req.params;
      const [post]: Post[] = await getPostById.execute({ postId });

      if (!post || post.isDeleted === true)
        return next(new AppError('Could not find a post with this id', 400));

      parentId = post.id;
    }

    // Only reposts can be without the text content
    if (type !== 'repost') {
      if (!content)
        return next(new AppError(`The ${type} content cannot be empty`, 400));
    }

    const [newPost]: NewPost[] = await db
      .insert(posts)
      .values({
        authorId,
        parentId,
        type,
        content,
      })
      .returning();

    if (!newPost) {
      return next(
        new AppError('An error has occurred while creating your post.', 400)
      );
    }

    res.status(201).json({
      status: 'success',
      data: {
        newPost,
      },
    });
  });
};

export const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const userId = req.user!.id;
    const { content } = req.body;

    const [updatedPost]: Partial<Post>[] = await db
      .update(posts)
      .set({ content, updatedAt: new Date(Date.now()) })
      .where(and(eq(posts.id, postId), eq(posts.authorId, userId)))
      .returning({
        id: posts.id,
        content: posts.content,
        updatedAt: posts.updatedAt,
      });

    res.status(202).json({
      status: 'success',
      data: {
        updatedPost,
      },
    });
  }
);

export const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const userId = req.user!.id;

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

/**
 * Post interactions
 */

/**
 * A controller which checks if the user has liked the post already
 * Check if the post exists and has not been deleted already
 * If not, creates a like for this post
 * If already liked, removes the like
 */
export const togglePostLike = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const userId = req.user!.id;
    const [post]: Post[] = await getPostById.execute({ postId });

    if (!post || post.isDeleted === true)
      return next(new AppError('Could not find a post with this id', 400));

    const [likeLookup]: Like[] = await findLike.execute({ postId, userId });

    let liked: boolean;

    if (likeLookup) {
      await db.delete(likes).where(eq(likes.id, likeLookup.id));
      liked = false;
    } else {
      await db.insert(likes).values({ userId, postId });
      liked = true;
    }
    // const likes = await getLikesByPostId.execute({ postId: req.params.postId });

    // const likes = await getLikesByPostId.execute({ postId: req.params.postId });

    res.status(200).json({
      status: 'success',
      data: { liked },
    });
  }
);
