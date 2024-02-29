import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import logger from '../utils/logger';

const sendDevError = (err: AppError, req: Request, res: Response) => {
  // API error handling
  logger.error(err);
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Rendered website error handling
    // change to render() later on TODO:
    res.status(err.statusCode).json({
      title: 'Error',
      msg: err.message,
    });
  }
};

//TODO:
const sendProdError = (err: AppError, req: Request, res: Response) => {
  // API error handling
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
  if (err.isOperational) {
    res.status(err.statusCode).send(`${err}`);
  } else {
    res.status(err.statusCode).send(`${err}`);
  }
};

const globalErrorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
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
