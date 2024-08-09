class AppError extends Error {
  isOperational: boolean;
  status: string;
  statusCode: number;

  constructor(
    message: string,
    statusCode: number,
    isOperational: boolean = true
  ) {
    super(message);

    this.isOperational = isOperational;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
