import express from 'express';
import * as boryParser from 'body-parser';
import Db from './database/db';
import Controller from './controllers/controller.interface';
import errorMiddleWare from './middlewares/error.middleware';
import cookieParser from 'cookie-parser';

class App {
  public app: express.Application;
  private db: Db;
  public port: number;
  constructor(controllers: Array<Controller>, port: number) {
    this.app = express();
    this.db = new Db();
    this.port = port;
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(boryParser.json());
    this.app.use(cookieParser());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleWare);
  }

  private initializeControllers(controllers: Array<Controller>) {
    if (controllers != null) {
      controllers.forEach(controller => {
        this.app.use('/', controller.router);
      });
    }
  }
  // start listen on port (start application)
  public listen() {
    this.app.listen(this.port);
    console.log(`App is running at port : ${this.port}`);
  }

  // connect to database
  public async connectDatabase() {
    await this.db.connect();
  }

  // disconnect to database
  public async disConnectDatabase() {
    await this.db.connect();
  }
}

export default App;
