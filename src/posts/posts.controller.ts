import express from 'express';
import PostModel from '../posts/post.model';
import Post from '../posts/post.interface';
import Controller from '../controllers/controller.interface';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import validationMiddleware from '../middlewares/validation.middleware';
import CreatePostDto from '../posts/posts.dto';
import authMiddleware from '../middlewares/auth.middleware';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import HttpException from '../exceptions/httpexception';

class PostsController implements Controller {
  public path = '/posts';
  public router = express.Router();

  constructor() {
    this.initializeRouters();
  }

  // iniitialize routes
  private initializeRouters() {
    this.router
      .all(`${this.path}*`, authMiddleware)
      .get(this.path, this.getAllPosts)
      .post(this.path, validationMiddleware(CreatePostDto), this.createNewPost)
      .get(`${this.path}/:id`, this.getPost)
      .put(
        `${this.path}/:id`,
        validationMiddleware(CreatePostDto),
        this.updatePost
      )
      .patch(
        `${this.path}/:id`,
        validationMiddleware(CreatePostDto, true),
        this.updatePost
      )
      .delete(`${this.path}/:id`, this.deletePost);
  }

  // get all posts
  private async getAllPosts(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      const posts = await PostModel.find({
        author: (request as RequestWithUser).user._id
      });
      response.send(posts);
    } catch (error) {
      next(new HttpException(500, error));
    }
  }

  // create new post
  private async createNewPost(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      const post: Post = request.body;
      const model = new PostModel(post);
      model.author = (request as RequestWithUser).user._id;
      let doc = await model.save();
      response.send(doc);
    } catch (error) {
      next(new HttpException(500, error));
    }
  }

  // get specific post
  private async getPost(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      let post = await PostModel.findOne({
        _id: request.params.id,
        author: (request as RequestWithUser).user._id
      });
      if (post) {
        response.send(post);
      } else {
        next(new PostNotFoundException(request.params.id));
      }
    } catch (error) {
      next(new HttpException(500, error));
    }
  }

  // update post
  private async updatePost(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      const post = await PostModel.findOneAndUpdate(
        {
          _id: request.params.id,
          author: (request as RequestWithUser).user._id
        },
        request.body,
        { new: true }
      );
      if (post) {
        response.send(post);
      } else {
        next(new PostNotFoundException(request.params.id));
      }
    } catch (error) {
      next(new HttpException(500, error));
    }
  }

  // delete post
  private async deletePost(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      const post = await PostModel.findOneAndDelete(
        {
          _id: request.params.id,
          author: (request as RequestWithUser).user.id
        },
        request.body
      );
      if (post) {
        response.send(post);
      } else {
        next(new PostNotFoundException(request.params.id));
      }
    } catch (error) {
      next(new HttpException(500, error));
    }
  }
}

export default PostsController;
