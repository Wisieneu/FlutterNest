import { Response, Request, NextFunction } from 'express';
import { eq } from 'drizzle-orm';

import { db } from '../db';
import * as userSchemaHandler from '../db/user/user.handlers';
import catchAsync from '../utils/catchAsync';
import { User, users } from '../db/user/user.schema';

// End user route handlers
export const getMyAccount = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const [user]: Partial<User>[] = await db
      .select({})
      .from(users)
      .where(eq(users.id, req.user!.id));

    return res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  }
);

export const updateMyAccount = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const updatedFields = req.body as Partial<User>;
    const userId = req.user!.id;

    const updatedUser = await userSchemaHandler.updateEndUser(
      userId,
      updatedFields
    );

    return res.status(200).json({
      status: 'success',
      data: {
        updatedUser,
      },
    });
  }
);

export const deleteMyAccount = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const userId = req.user!.id;

    await userSchemaHandler.deleteEndUser(userId);

    return res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

/**
 * Admin routes - unsafe to be used by end users
 * could cause harm to the database if used by unauthorized users
 * these routes do not perform the necessary input validations
 */
export const getUsers = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const usersArray = await db.select().from(users);
    return res.status(200).json({
      status: 'success',
      data: {
        users: usersArray,
      },
    });
  }
);

export const getUser = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { userId } = req.params || req.body;

    const user = await db.query.users.findFirst({
      columns: {
        password: false,
      },
      where: eq(users.id, userId),
    });

    return res.status(200).json({
      status: 'success',
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
      status: 'success',
      data: {
        newUser,
      },
    });
  }
);

/**
 * Admin route for manually updating a user in a database
 */
export const updateUser = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const updatedUser = await db.update(users).set(req.body);

    return res.status(200).json({
      status: 'success',
      data: {
        updatedUser,
      },
    });
  }
);

export const deleteOneUser = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { userId } = req.body;

    const [deletedUser]: User[] = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    return res.status(204).json({
      status: 'success',
      data: { deletedUser },
    });
  }
);
