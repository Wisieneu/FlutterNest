import { Response, Request, NextFunction } from "express";
import { eq } from "drizzle-orm";

import { db } from "../db";
import * as userSchemaHandler from "../db/user/user.handlers";
import catchAsync from "../utils/catchAsync";
import { User, users } from "../db/user/user.schema";
import AppError from "../utils/appError";
import { deleteFileFromS3, uploadFileToS3 } from "../utils/s3";
import userConfig from "../db/user/user.config";

/**
 * End user route handlers
 */

// GET routes

export const getUserByUsername = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { username } = req.params;

    const user = await userSchemaHandler.getEndUser(username);

    return res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

export const getMyAccount = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = await userSchemaHandler.getEndUser(req.user!.username);
    if (!user)
      next(
        new AppError("An error has occurred while searching for the user", 403)
      );

    return res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

// PATCH routes
export const updateMyAccount = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const updatedUser = await userSchemaHandler.updateEndUser(
      req.user!.id,
      req.body
    );

    return res.status(200).json({
      status: "success",
      data: {
        updatedUser,
      },
    });
  }
);

export const updateUserPhoto = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    if (!req.file)
      return next(new AppError("The attached file is invalid", 400));

    if (req.user!.profilePicture !== userConfig.defaultProfilePicture)
      await deleteFileFromS3(req.user!.profilePicture!);

    await uploadFileToS3(req.file);

    const profilePic = await db
      .update(users)
      .set({
        profilePicture: req.file.filename,
      })
      .where(eq(users.id, req.user!.id))
      .returning({ profilePicture: users.profilePicture });

    return res.status(200).json({
      status: "success",
      data: {
        profilePic,
      },
    });
  }
);

export const deactivateAccount = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const deactivatedUser = await userSchemaHandler.deactivateEndUser(
      req.user!
    );

    res.cookie("jwt", "loggedout");

    return res.status(200).json({
      status: "success",
      data: {
        message: "Account deactivated successfully",
      },
    });
  }
);

// DELETE routes
export const deleteAccount = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    await db.delete(users).where(eq(users.id, req.user!.id));

    res.cookie("jwt", "loggedout");

    return res.status(200).json({
      status: "success",
      data: null,
    });
  }
);

/**
 * Admin routes - unsafe to be used by end users
 * could cause harm to the database if used by unauthorized users
 * these routes do not perform the necessary input validations
 * these routes expose sensitive data
 */

/**
 * Admin route for getting users
 */
export const getUsers = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const usersArray = await db.select().from(users);

    return res.status(200).json({
      status: "success",
      data: {
        users: usersArray,
      },
    });
  }
);

/**
 * Admin route for a single user
 */
export const getUser = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { userId } = req.params || req.body;

    const user = await db.select().from(users).where(eq(users.id, userId));

    return res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

/**
 * Admin route for manually inserting a user into the database
 */
export const createUser = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const newUser = await db.insert(users).values(req.body);

    return res.status(201).json({
      status: "success",
      data: {
        newUser,
      },
    });
  }
);

/**
 * Admin route for manually updating a user entry in the database
 */
export const updateUserById = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { userId } = req.params || req.body;

    const updatedUser = await db
      .update(users)
      .set(req.body)
      .where(eq(users.id, userId));

    return res.status(200).json({
      status: "success",
      data: {
        updatedUser,
      },
    });
  }
);

/**
 * Admin route for manually deleting a user entry in the database
 */
export const deleteOneUserById = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { userId } = req.params || req.body;

    const [deletedUser]: User[] = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    return res.status(204).json({
      status: "success",
      data: { deletedUser },
    });
  }
);
