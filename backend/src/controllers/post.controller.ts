import { NextFunction, Request, Response } from 'express';

import { db } from '../db';
import { NewPost, Post, posts } from '../db/post/post.schema';
import { eq } from 'drizzle-orm';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

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
    const { id } = req.params;

    const result = await db.query.posts.findFirst({
      where: eq(posts.id, id),
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

export const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { content } = req.body;

    const newPost: NewPost[] = await db
      .insert(posts)
      .values({ content, authorId: req.user!.id })
      .returning();

    if (!newPost || newPost.length < 1) {
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
  }
);

export const updatePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;

  const updatedPost: { id: string; content: string }[] = await db
    .update(posts)
    .set({ content })
    .where(eq(posts.id, id))
    .returning({ id: posts.id, content: posts.content });

  res.status(200).json({
    status: 'success',
    data: {
      updatedPost,
    },
  });
});

export const deletePost = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: { message: 'This route is not defined yet.' },
  });
});
