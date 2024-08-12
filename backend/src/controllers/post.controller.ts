import { NextFunction, Request, Response } from 'express';

import { db } from '../db';
import { Like, NewPost, Post, likes, posts } from '../db/post/post.schema';
import { and, eq } from 'drizzle-orm';
import * as postHandler from '../db/post/post.handlers';
import { postType } from '../db/post/post.config';
import { User, users } from '../db/user/user.schema';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

export const getPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await postHandler.getPostsPaginated(page, limit);

    return res.status(200).json({
      status: 'success',
      data: {
        result,
        page,
        amount: result.length,
      },
    });
  }
);

export const getPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    const result = await postHandler.getPostById(postId);

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
 * TODO: attaching images
 */
export const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user!.id;
    const { textContent } = req.body;
    console.log(req.body);

    const [newPost] = await db
      .insert(posts)
      .values({
        authorId,
        type: 'post',
        textContent,
      })
      .returning();

    if (!newPost) {
      return next(new AppError('An error has occurred while creating your post.', 400));
    }

    res.status(201).json({
      status: 'success',
      data: {
        newPost,
      },
    });
  }
);

export const commentPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //TODO: implement
    return res.status(200).json({
      status: 'route not implemented yet',
      data: null,
    });
  }
);

export const repostPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //TODO: implement
    return res.status(200).json({
      status: 'route not implemented yet',
      data: null,
    });
  }
);

/**
 * Updates a post
 * Only the author of the post can update it
 * Checks if the post exists and has not been deleted already
 */
export const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const userId = req.user!.id;
    const { textContent } = req.body;

    const [updatedPost]: Partial<Post>[] = await db
      .update(posts)
      .set({ textContent, updatedAt: new Date(Date.now()) })
      .where(and(eq(posts.id, postId), eq(posts.authorId, userId)))
      .returning({
        id: posts.id,
        textContent: posts.textContent,
        updatedAt: posts.updatedAt,
      });

    res.status(200).json({
      status: 'success',
      data: {
        updatedPost,
      },
    });
  }
);

/**
 * Deletes a post
 * Only the author of the post can delete it
 * Checks if the post exists and has not been deleted already
 * Sets the isDeleted flag to true
 */
export const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const userId = req.user!.id;

    const [deletedPost] = await db
      .update(posts)
      .set({ isDeleted: true })
      .where(
        and(eq(posts.id, postId), eq(posts.authorId, userId), eq(posts.isDeleted, false))
      )
      .returning();

    if (!deletedPost) {
      return next(new AppError('Could not find a post with this id', 400));
    }

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
 * A controller which creates a like for a post
 * Checks if the user has liked the post already
 * Checks if the post exists and has not been deleted already
 */
export const likePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const userId = req.user!.id;
    const [post] = await postHandler.getPostById(postId);

    if (!post || post.isDeleted === true)
      return next(new AppError('Could not find a post with this id', 400));
    const [likeLookup]: Like[] = await postHandler.findLike(userId, postId);
    if (likeLookup) {
      return next(new AppError('Post is already liked by the current user', 400));
    }

    await postHandler.likePost(postId, userId);

    res.status(200).json({
      status: 'success',
      message: 'Like added successfully',
    });
  }
);

/**
 * A controller which removes a like from a post
 * Checks if the user has liked the post already
 * Checks if the post exists and has not been deleted already
 */
export const unlikePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const userId = req.user!.id;
    const [post] = await postHandler.getPostById(postId);

    if (!post || post.isDeleted === true)
      return next(new AppError('Could not find a post with this id', 400));

    const [likeLookup]: Like[] = await postHandler.findLike(userId, postId);

    if (!likeLookup)
      return next(new AppError('Post is not liked by the current user', 400));

    await db.delete(likes).where(eq(likes.id, likeLookup.id));

    res.status(200).json({
      status: 'success',
      message: 'Like removed successfully',
    });
  }
);
