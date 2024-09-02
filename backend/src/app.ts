import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// import compression from 'compression';
// import helmet from 'helmet';
// import { constants } from 'zlib';

import morganMiddleware from "./middlewares/morgan.middleware";
import userRouter from "./routes/user.routes";
import postRouter from "./routes/post.routes";
import globalErrorHandler from "./controllers/error.controller";

import { db } from "./db";

class App {
  public app: Application;
  public db = db;

  constructor() {
    this.app = express();
    this.initializeMiddlewarePlugins();
    this.attachRoutes();
  }

  public getInstance(): Application {
    return this.app;
  }

  protected initializeMiddlewarePlugins(): void {
    // TODO: configure cors, helmet, urlencoded, compression for production
    this.app.use(
      cors({
        origin: "http://localhost:5173",
        optionsSuccessStatus: 200,
        credentials: true,
      })
    );
    // this.app.use(helmet());
    // this.app.use(express.urlencoded({ extended: false }));
    // this.app.use(compression({level: 6,memLevel: 8,strategy: constants.Z_DEFAULT_STRATEGY,flush: constants.Z_NO_FLUSH,chunkSize: 16384,windowBits: 15,threshold: 0}));
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(morganMiddleware);
  }

  protected attachRoutes(): void {
    this.app.use("/api/v1/users", userRouter);
    this.app.use("/api/v1/posts", postRouter);
    this.app.use(globalErrorHandler);
  }
}

const app = new App();

export default app;
