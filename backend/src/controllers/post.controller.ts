import { NextFunction, Request, Response } from "express";
import { Like, Post, likes, posts } from "../db/post/post.schema";
import { and, eq } from "drizzle-orm";

import * as postHandler from "../db/post/post.handlers";
import * as postMediaFilesHandler from "../db/postMediaFiles/post.media.files.handlers";

import { db } from "../db";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

import { PostType } from "../db/post/post.config";
import { User } from "db/user/user.schema";

export const getPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const data = await postHandler.getPostsPaginatedQuery(
      and(eq(posts.isDeleted, false), eq(posts.type, "post")),
      Number(req.query.page) || 1,
      limit,
      req.user?.id
    );

    return res.status(200).json({
      status: "success",
      data,
      page,
      amount: data.length,
    });
  }
);

export const getPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    const result = await postHandler.getPostById(postId);

    if (!result) {
      next(new AppError("Could not find a post with this ID", 404));
    }

    return res.status(200).json({
      status: "success",
      data: {
        result,
      },
    });
  }
);

export const getPostCommentsPaginated = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const { page, limit } = req.query;

    const post = await postHandler.getPostById(postId);

    if (!post) {
      next(new AppError("Could not find a post with this ID", 404));
    }

    const result = await postHandler.getPostCommentsPaginated(
      postId,
      Number(page),
      Number(limit)
    );

    return res.status(200).json({
      status: "success",
      data: {
        result: result.result,
        commentCount: result.commentCount.commentCount,
        page: page,
        amount: result.result.length,
      },
    });
  }
);

export const getPostsByUserId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { page, limit, type } = req.query;

    const result = await postHandler.getPostsByUserIdPaginated(
      userId,
      type as PostType,
      Number(page),
      Number(limit)
    );

    return res.status(200).json({
      status: "success",
      data: {
        result,
      },
    });
  }
);

export const getPostsLikedByUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { page, limit, type } = req.query;

    const result = await postHandler.getPostsByUserIdPaginated(
      userId,
      type as PostType,
      Number(page),
      Number(limit)
    );

    return res.status(200).json({
      status: "success",
      data: {
        result,
      },
    });
  }
);

/**
 * Creates a new post
 */
export const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user!.id;
    const { textContent } = req.body;

    const newPost = await postHandler.insertPost(authorId, textContent, "post");

    if (!newPost) {
      return next(
        new AppError("An error has occurred while creating your post.", 400)
      );
    }

    let postFiles;
    // After the post is created, we can insert the media files if there are any
    if (
      req.files &&
      (req.files.length as number) > 0 &&
      Array.isArray(req.files)
    ) {
      postFiles = await postMediaFilesHandler.insertPostMediaFiles(
        req.files,
        newPost.id,
        authorId
      );
    }

    res.status(201).json({
      status: "success",
      data: {
        newPost: {
          ...newPost,
          media: postFiles,
        },
      },
    });
  }
);

export const commentPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const author = req.user! as User;
    const { textContent } = req.body;

    const result = await postHandler.insertPost(
      author.id,
      textContent,
      "comment",
      req.params.postId
    );

    let postFiles;
    // After the post is created, we can insert the media files if there are any
    if (
      req.files &&
      (req.files.length as number) > 0 &&
      Array.isArray(req.files)
    ) {
      postFiles = await postMediaFilesHandler.insertPostMediaFiles(
        req.files,
        result.id,
        author.id
      );
    }

    res.status(201).json({
      status: "success",
      data: {
        newPost: {
          ...result,
          author,
          media: postFiles,
        },
      },
    });
  }
);

export const repostPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //TODO: implement
    return res.status(200).json({
      status: "route not implemented yet",
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
      status: "success",
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
        and(
          eq(posts.id, postId),
          eq(posts.authorId, userId),
          eq(posts.isDeleted, false)
        )
      )
      .returning();

    if (!deletedPost) {
      return next(new AppError("Could not find a post with this id", 400));
    }

    // Delete the post media files
    postMediaFilesHandler.deletePostMediaFiles(postId);

    res.status(204).json({
      status: "success",
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
 */
export const likePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const userId = req.user!.id;
    const post = await postHandler.getPostById(postId);

    if (!post || post.isDeleted === true)
      return next(new AppError("Could not find a post with this id", 400));
    const [likeLookup]: Like[] = await postHandler.findLike(userId, postId);
    if (likeLookup) {
      return next(
        new AppError("Post is already liked by the current user", 400)
      );
    }

    await postHandler.likePost(postId, userId);

    res.status(200).json({
      status: "success",
      message: "Like added successfully",
    });
  }
);

/**
 * A controller which removes a like from a post
 * Checks if the user has liked the post or not
 */
export const unlikePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const userId = req.user!.id;
    const post = await postHandler.getPostById(postId);
    if (!post)
      return next(new AppError("Could not find a post with this id", 400));
    const [likeLookup]: Like[] = await postHandler.findLike(userId, postId);
    if (!likeLookup)
      return next(new AppError("Post is not liked by the current user", 400));

    await postHandler.unlikePost(postId, userId);

    res.status(200).json({
      status: "success",
      message: "Like removed successfully",
    });
  }
);

export const test = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const response = await postHandler.getPostsPaginatedQuery(
      and(eq(posts.isDeleted, false), eq(posts.type, "post")),
      Number(req.query.page) || 1,
      Number(req.query.limit) || 10,
      req.user!.id
    );
    res.status(200).json({
      status: "success",
      data: {
        response,
      },
    });
  }
);
