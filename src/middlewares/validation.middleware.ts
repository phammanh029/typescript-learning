import express, { request } from 'express';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import HttpException from '../exceptions/httpexception';

function validationMiddleware<T>(type: any): express.RequestHandler {
  return async (req, res, next) => {
    try {
      const errors = await validate(plainToClass(type, req.body));
      if (errors.length > 0) {
        next(
          new HttpException(
            400,
            errors.map(err => Object.values(err.constraints)).join(',  ')
          )
        );
      } else {
        next();
      }
    } catch (error) {}
  };
}
export default validationMiddleware;