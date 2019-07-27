import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import DataStoredInToken from '../authentication/DataStoredInToken.interface';
import UserModel from '../users/user.model';

import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import InvalidAuthenticationException from '../exceptions/InvalidAuthenticationException';
async function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
    console.log('check authen');
    
  // get cookie
  const cookies = request.cookies;
  console.log(cookies.Authorization);
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET || 'secret';
    //console.log(secret)
    try {
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as DataStoredInToken;
      const id = verificationResponse._id;
      
      // check if id exists
      const user = await UserModel.findById(id);
      console.log(user);
      if (user) {
        let req = request as RequestWithUser;
        req.user = user;
        next();
      } else {
        next(new InvalidAuthenticationException());
      }
    } catch (error) {
        console.log(error);
      next(new InvalidAuthenticationException());
    }
  } else {
    next(new InvalidAuthenticationException());
  }
}

export default authMiddleware;
