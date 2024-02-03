import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { NextFunction, Response } from 'express';
import { User } from '@prisma/client';

import { Request } from '../types';
import { database } from '../config/database';
import { changedPasswordAfter } from '../models/user.model';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

dotenv.config({ path: './.env' });

declare module 'jsonwebtoken' {
  export interface UserIDJwtPayload extends jwt.JwtPayload {
    userId: string;
  }
}

const signToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendAuthToken = (
  user: User,
  statusCode: number,
  req: Request,
  res: Response,
) => {
  const token = signToken(user.id);
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000, // number of days from .env file
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // Remove password from output
  user.password = undefined!;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const restrictLoginAccess = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Getting token either from headers or cookies
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError('Access denied - please log in.', 401));
    }

    // 2) Verifying the token
    const decodedToken = <jwt.UserIDJwtPayload>(
      jwt.verify(token, process.env.JWT_SECRET as string)
    );

    // 3) Check if user still exists in database
    const currentUser = await database.user.findFirst({
      where: { id: decodedToken.userId },
    })!;
    if (!currentUser) {
      return next(new AppError('Invalid token. Please log in again.', 401));
    }

    // 4) Check if user changed the password after the token was issued
    const pwChangedJwtCheck = await changedPasswordAfter(
      currentUser,
      new Date(Date.now()),
    );
    if (!pwChangedJwtCheck) {
      return next(
        new AppError(
          'User recently changed their password, please log in again.',
          401,
        ),
      );
    }

    // Grant access to a login-protected route if all steps above are passed
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  },
);

export const restrictTo = (roles: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (
      !req.user ||
      !roles.includes(req.user.role) ||
      req.user.role !== 'ADMIN'
    ) {
      // Reject response if user's role is not in the restricted roles list for that route
      return next(
        new AppError('You do not have permission to perform this action.', 403),
      );
    }
    next();
  };
};

export const signupUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, passwordConfirm, username, email } = req.body;
    const newUser = await database.user.signUp(
      email,
      username,
      password,
      passwordConfirm,
    );
    createAndSendAuthToken(newUser, 201, req, res);
  },
);

export const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Please provide an email and a password.', 400));
    }

    const user = await database.user.findFirstOrThrow({
      where: {
        email,
      },
    });
    const credentialsCorrect = await bcrypt.compare(password, user.password);
    if (credentialsCorrect) {
      return createAndSendAuthToken(user, 200, req, res);
    }
  },
);
