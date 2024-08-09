import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import logger from '../utils/logger';

const sendDevError = (err: AppError, req: Request, res: Response) => {
  console.log(err.message);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
  logger.error(err);
};

//TODO:
const sendProdError = (err: AppError, req: Request, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Error',
      msg: err.message,
    });
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
  } else {
    sendProdError(appErr, req, res);
  }
};

export default globalErrorHandler;
