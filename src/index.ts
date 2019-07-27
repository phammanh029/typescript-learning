import express from 'express';
import * as bodyparser from 'body-parser';

import App from './app';
import PostsController from './controllers/posts.controller';

// create new app
const app = new App([ new PostsController()], 3000);
app.listen();
app.connectDatabase();

// const app = express();
// function loggerMiddleware(
//   request: express.Request,
//   response: express.Response,
//   next: any
// ) {
//   console.log(`${request.method}, ${request.path}`);
//   next();
// }
// app.use(loggerMiddleware);
// app.use(bodyparser.json());
// app.get('/', (request: express.Request, response: express.Response) => {
//   response.send(request.body);
// });

// app.listen(process.env.PORT || 3000, () => {
//   console.log(`App running at localhost: ${process.env.PORT || 3000}`);
// });
