import { NextFunction, Request, Response } from 'express';
import { RequestError } from '../errors/request-error';

export default function ErrorHandler(
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  const { status } = error as RequestError;

  return res.status(status ?? 500).json({
    success: false,
    message: error.message,
  });
}
