import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';

const sendDevError = (err: AppError, req: Request, res: Response) => {
  console.error(err);
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
      });
    } else {
      res.status(err.statusCode).render('error', {
        title: 'Error',
        msg: err.message,
      });
    }
  }
};

//TODO:
const sendProdError = (err: AppError, req: Request, res: Response) => {
  console.error(err);
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: 'error',
      message: 'An unknown error has occurred. Please try again later.',
    });
  }
};

const globalErrorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const appErr: AppError =
    err instanceof AppError ? err : new AppError(err.message, 500, false);

  if (process.env.NODE_ENV === 'development') {
    sendDevError(appErr, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendProdError(appErr, req, res);
  }
};

export default globalErrorHandler;
