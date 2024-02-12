import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import isEmail from 'validator/lib/isEmail';

import { db } from '../db';
import { User, NewUser, users } from '../db/user/user.schema';
import { signUpEndUser } from '../db/user/user.handlers';

import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { date } from 'drizzle-orm/mysql-core';

dotenv.config({ path: './.env' });

// Authentication middlewares/functions
/**
 * Creates a JWT token based on userId
 * @param {string} userId
 * @returns {string} JWT token
 */
const signToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: `${process.env.JWT_EXPIRES_IN}d`,
  });
};

/**
 * Creates and sends an authentication token for the given user.
 *
 * @param {User} user - The user object.
 * @param {number} statusCode - The status code to be sent in the response.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {void}
 */
const createAndSendAuthToken = (
  user: User,
  statusCode: number,
  req: Request,
  res: Response
) => {
  const token = signToken(user.id);
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + Number(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000 // number of days from .env file - converted to miliseconds by multiplication
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

/**
 * TLDR: is the user still allowed to be logged in, or should he reauthenticate? Is the JWT token still valid?
 *
 * @middleware
 * A middleware which restricts access to a certain route to authenticated users only
 *
 * Gets the jwt token either from headers or cookies, verifies it
 * Check if the token is not expired
 * Checks if user still exists in the database
 * Check if user changed the password after the token was issued
 * Adds the current user to the request object
 * @returns {void} - calls the next middleware if no authentiaction contraindications are found
 */
export const restrictLoginAccess = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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

    const decodedToken = <jwt.JwtPayload>(
      jwt.verify(token, process.env.JWT_SECRET as string)
    );

    const [currentUser]: User[] = await db
      .select()
      .from(users)
      .where(eq(users.id, decodedToken.userId));

    // If user does not exist
    if (!currentUser) {
      return next(new AppError('Invalid token. Please log in again.', 401));
    }

    // If user changed their password after the token was created
    console.log(currentUser.lastPasswordChangeDate);
    console.log(decodedToken);
    console.log(new Date(decodedToken.iat!));
    // const passwordChangeCase =
    if (false) {
      return next(
        new AppError(
          'User recently changed their password, please log in again.',
          401
        )
      );
    }

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  }
);

/**
 * A middleware, making the route accessible only to users of a certain role
 * @param {string} role - specific role
 * calls the next middleware if the role condition is satisfied
 */
export const restrictTo = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !(role === req.user.role) || req.user.role !== 'admin') {
      // Reject response if user's role is not in the restricted roles list for that route
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};

/**
 * Signs up a new user
 * @param {Request} req containing a json body with password, passwordConfirm, username, email inputs
 */
export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, passwordConfirm, username, email } = req.body;
    if (password !== passwordConfirm)
      return next(new AppError('Provided passwords do not match.', 400));

    const newUser: NewUser = await signUpEndUser(password, username, email);
    createAndSendAuthToken(newUser as User, 201, req, res);
  }
);

/**
 * Logs the user in and saves an auth token
 *
 * Validates the provided credentials
 * Recognizes whether the login is a password or an email
 * Queries for the user with the username/email and check the password correctness
 * Sends back an authentication token
 * @param {Request} req: containing a json body with username or email and password inputs
 */
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { login, password } = req.body;
    if (!login || !password)
      return next(new AppError('Please provide a login and a password.', 400));

    let [user]: User[] = await db
      .select()
      .from(users)
      .where(eq(isEmail(login) ? users.email : users.username, login));

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      return createAndSendAuthToken(user, 200, req, res);
    }
  }
);

/**
 * Signs the user out,
 */
export const logout = catchAsync(
  (req: Request, res: Response, next: NextFunction) => {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({
      status: 'success',
    });
  }
);
