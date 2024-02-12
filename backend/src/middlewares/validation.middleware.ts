import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import AppError from '../utils/appError';

/**
 * Middleware function for validating request data using express-validator.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function to be called.
 * @returns {void}
 */
export default function validatorMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Map through the errors array and extract the error messages, join them into a single string
    const errorMessages = errors.array().map((error) => error.msg);
    const errorString = errorMessages.join(', ');
    return next(
      new AppError(
        `The provided credentials were not correct: ${errorString}`,
        400
      )
    );
  }
  next();
}
