import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/httpexception';

function errorMiddleWare(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  response.status(status).send({
    status: status,
    message: message
  });
}

export default errorMiddleWare;
