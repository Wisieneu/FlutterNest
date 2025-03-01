import { Response, Request, NextFunction } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { db } from "../db";
import * as userHandler from "../db/user/user.handlers";
import catchAsync from "../utils/catchAsync";
import { User, users, UserUnsafe } from "../db/user/user.schema";
import AppError from "../utils/appError";
import { deleteFileFromS3, uploadFileToS3 } from "../utils/s3";
import userConfig from "../db/user/user.config";

/**
 * End user route handlers
 */

// GET routes

export const getOneUser = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { username, id } = req.query;

    const user =
      (username &&
        (await userHandler.getEndUserByUsername(username as string))) ||
      (id && (await userHandler.getEndUserById(id as string)));

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
    const user = await userHandler.getEndUserByUsername(req.user!.username);
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

export const getMyAccountSettingsData = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    // TODO: omit some of the sensitive data (to be figured out which, later)

    const user = await userHandler.getEndUserSettingsData(req.user!.id);
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

export const returnAuthContextUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
      status: "success",
      data: {
        user: req?.user,
      },
    });
  }
);

export const getNewcomerUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const limit = Number(req.body.limit) || 4;
    const users = await userHandler.getNewcomerUsers(limit);
    return res.status(200).json({
      status: "success",
      data: {
        users,
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
    const { displayName, location, website, bio } = req.body;
    const updatedUser = await userHandler.updateEndUser(req.user!.id, {
      displayName,
      location,
      website,
      bio,
    });

    return res.status(200).json({
      status: "success",
      data: {
        updatedUser,
      },
    });
  }
);

export const updateUserPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;
    const [user]: UserUnsafe[] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user!.id));

    if (!user || user.active === false)
      return next(new AppError("User not found", 400));

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordCorrect)
      return next(new AppError("Incorrect password", 400));
    const updatedUser = await userHandler.updateUserPassword(
      user.id,
      newPassword
    );

    return res.status(200).json({
      status: "success",
      data: {
        updatedUser,
      },
    });
  }
);

export const updateUserProfilePicture = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    if (!req.file)
      return next(new AppError("The attached file is invalid", 400));

    if (req.user!.profilePicture !== userConfig.defaultProfilePicture)
      await deleteFileFromS3(req.user!.profilePicture!);

    req.file.filename = `${req.user!.username}-${Date.now()}-_pfp.jpeg`;
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
    const deactivatedUser = await userHandler.deactivateEndUser(req.user!);

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
 * First tries to search by username, then by id
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
