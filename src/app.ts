import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';

import userRouter from './routes/user.routes';
import tweetRouter from './routes/tweet.routes';
import viewRouter from './routes/view.routes';
import initDb from './config/database';
// import { PrismaClient } from '@prisma/client';

class App {
  public app: Application;
  public db: any;

  constructor() {
    this.app = express();
    this.db = this.initializeDatabaseConnection();
    this.initializeMiddlewarePlugins();
    this.attachRoutes();
  }

  protected initializeDatabaseConnection() {
    return initDb();
  }

  protected initializeMiddlewarePlugins(): void {
    this.app.use(
      cors({
        credentials: true,
      })
    );
    this.app.use(helmet());
    this.app.use(cookieParser());
    this.app.use(morgan('dev'));
    this.app.use(bodyParser.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(compression());
  }

  protected attachRoutes(): void {
    this.app.use('/api/v1/users', userRouter);
    this.app.use('/api/v1/tweets', tweetRouter);
    this.app.use('/', viewRouter);
  }
}

const app = new App();

export default app;
