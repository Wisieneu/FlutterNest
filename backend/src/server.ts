import { Application } from 'express';
import dotenv from 'dotenv';

import app from './app';
import logger from './utils/logger';

dotenv.config({ path: './.env' });

class Server {
  private port = process.env.SERVER_PORT || 6699;
  public server;

  constructor(app: Application) {
    this.server = this.listen(app);
  }

  private listen(app: Application) {
    const baseUrl = `http://localhost:${this.port}`;
    return app.listen(this.port, (): void => {
      logger.info(`API running on ${baseUrl}\n`);
    });
  }
}

const server = new Server(app.app).server;

process.on('unhandledRejection', async (err) => {
  logger.error('\x1b[41m❌UNHANDLED REJECTION! Shutting down... ＞﹏＜\x1b[0m');
  logger.error('Error details:');
  logger.error(err);
  server.close(() => {
    process.exit(1);
  });
});
