import express from 'express';
import postModel from '../models/post.model';
import Post from '../posts/post.interface';
import Controller from './controller.interface';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import validationMiddleware from '../middlewares/validation.middleware';
import CreatePostDto from '../posts/posts.dto';

class PostsController implements Controller {
  public path = '/posts';
  public router = express.Router();

  constructor() {
    this.initializeRouters();
  }

  // iniitialize routes
  private initializeRouters() {
    this.router.get(this.path, this.getAllPosts);
    this.router.post(
      this.path,
      validationMiddleware(CreatePostDto),
      this.createNewPost
    );
    this.router.get(`${this.path}/:id`, this.getPost);
    this.router.put(
      `${this.path}/:id`,
      validationMiddleware(CreatePostDto),
      this.updatePost
    );
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(CreatePostDto, true),
      this.updatePost
    );
    this.router.delete(`${this.path}/:id`, this.deletePost);
  }

  // get all posts
  private async getAllPosts(
    request: express.Request,
    response: express.Response
  ) {
    const posts = await postModel.find().exec();
    response.send(posts);
    //response.send(PostModel.);
  }

  // create new post
  private async createNewPost(
    request: express.Request,
    response: express.Response
  ) {
    const post: Post = request.body;
    const model = new postModel(post);
    let doc = await model.save();
    response.send(doc);
  }

  // get specific post
  private async getPost(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      let post = await postModel.findById(request.params.id).exec();
      if (post) {
        response.send(post);
      } else {
        next(new PostNotFoundException(request.params.id));
      }
    } catch (error) {
      response.status(500).send(error);
    }
  }

  // update post
  private async updatePost(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      const post = await postModel
        .findByIdAndUpdate(request.params.id, request.body, { new: true })
        .exec();
      if (post) {
        response.send(post);
      } else {
        next(new PostNotFoundException(request.params.id));
      }
    } catch (error) {
      response.status(500).send(error);
    }
  }

  // delete post
  private async deletePost(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      const post = await postModel
        .findByIdAndDelete(request.params.id, request.body)
        .exec();
      if (post) {
        response.send(post);
      } else {
        next(new PostNotFoundException(request.params.id));
      }
    } catch (error) {
      response.status(500).send(error);
    }
  }
}

export default PostsController;
