import 'dotenv/config';

import App from './app';
import AuthenticationController from './authentication/authentication.controller';
import UserController from './users/user.controller';
import PostsController from './posts/posts.controller';
//console.log(process.env.JWT_TOKEN);

// create new app
const app = new App(
  [new AuthenticationController(), new UserController(), new PostsController()],
  3000
);
// start listen on server
app.listen();

// connect to datbase service
app.connectDatabase();
