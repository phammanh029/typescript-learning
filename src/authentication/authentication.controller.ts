import validationMiddleware from '../middlewares/validation.middleware';
import bcrypt from 'bcrypt';
import Controller from '../controllers/controller.interface';
import express from 'express';
import UserDto from '../users/user.dto';
import UserModel from '../users/user.model';
import UserExistsException from '../exceptions/UserExistException';
import LoginDataDto from './LoginData.dto';
import InvalidCredentialExecption from '../exceptions/InvalidCredentialException';
import DataStoredInToken from './DataStoredInToken.interface';
import jwt from 'jsonwebtoken';
import TokenData from './TokenData.interface.';
import { NextFunction } from 'express-serve-static-core';
import authMiddleware from '../middlewares/auth.middleware';

class AuthenticationController implements Controller {
  public router = express.Router();
  public path = '/auth';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(UserDto),
      this.registerUser
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LoginDataDto),
      this.login.bind(this)
    );

    this.router.post(
      `${this.path}/logout`,
      authMiddleware,
      this.logout.bind(this)
    );
  }

  // register new user
  private async registerUser(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const userData: UserDto = request.body;
    let usr = await UserModel.findOne({ email: userData.email });
    console.log(usr);
    if (usr) {
      next(new UserExistsException(userData.email));
    } else {
      const password = await bcrypt.hash(userData.password, 10);
      const user = await UserModel.create({ ...userData, password: password });
      response.send(user);
    }
  }

  // log in user
  private async login(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const loginData: LoginDataDto = request.body;

    const user = await UserModel.findOne({ email: loginData.email });
    if (!user || !(await bcrypt.compare(loginData.password, user.password))) {
      next(new InvalidCredentialExecption());
    } else {
      const tokenData = this.createToken(user);
      response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
      response.send(tokenData);
    }
  }

  // issue a jwt token
  private createToken(user: any): TokenData {
    const expiresIn = 60 * 60;
    const secret = process.env.JWT_SECRET || 'secret';
    //console.log(secret);
    const payload: DataStoredInToken = {
      _id: user._id
    };

    return {
      expiresIn,
      token: jwt.sign(payload, secret, { expiresIn })
    };
  }

  private async logout(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    response.setHeader('Set-Cookie', ['Authorization=;HttpOnly;Max-Age=0']);
    response.send();
  }

  // generate cookie
  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token};HttpOnly;Max-Age=${
      tokenData.expiresIn
    }`;
  }
}

export default AuthenticationController;
