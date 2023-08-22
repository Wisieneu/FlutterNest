import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import userRouter from './routes/user.routes.js';
import tweetRouter from './routes/tweet.routes.js';
import initDb from './config/database.js';

class App {
  public db: NodePgDatabase;
  public app: Application;

  constructor() {
    this.app = express();
    this.db = this.initializeDatabaseConnection();
    this.initializeMiddlewarePlugins();
    this.attachRoutes();
  }

  protected initializeDatabaseConnection(): NodePgDatabase {
    return initDb();
  }

  protected initializeMiddlewarePlugins(): void {
    this.app.use(
      cors({
        credentials: true,
      }),
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
  }
}

const app = new App();

export default app;
