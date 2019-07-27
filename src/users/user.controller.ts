import { RequestWithUser } from './../interfaces/requestWithUser.interface';
import Controller from '../controllers/controller.interface';
import express from 'express';
import PostModel from '../posts/post.model';
import authMiddleware from '../middlewares/auth.middleware';
import NotAuthorizeException from '../exceptions/NotAuthorizeException';

class UserController implements Controller {
  public router = express.Router();
  public path = '/users';

  constructor() {
    this.initializeRoutes();
  }

  // initialize routes
  private initializeRoutes() {
    this.router.get(
      `${this.path}/:id/posts`,
      authMiddleware,
      this.getUserPosts
    );
  }

  // get posts of user
  private async getUserPosts(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const user = (request as RequestWithUser).user;
    //console.log(user.id);
    //console.log(request.params.id);
    if (user.id !== request.params.id) {
      next(new NotAuthorizeException());
      return;
    }
    // get all user posts
    try {
      const posts = await PostModel.find({ author: user._id });
      response.send(posts);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
