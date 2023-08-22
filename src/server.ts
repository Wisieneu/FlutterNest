import dotenv from 'dotenv';
import { Application } from 'express';

import app from './app.js';

dotenv.config({ path: './config.env' });

class Server {
  private port = process.env.PORT || 6699;
  public server;

  constructor(app: Application) {
    this.server = this.listen(app);
  }

  private listen(app: Application) {
    return app.listen(this.port, (): void => {
      console.log(
        `\x1b[33mApp running on http://localhost:${this.port}\x1b[0m`,
      );
    });
  }
}

const server = new Server(app.app).server;

process.on('unhandledRejection', async (err) => {
  console.log('\x1b[41m❌UNHANDLED REJECTION! Shutting down... ＞﹏＜\x1b[0m');
  console.log('Error details:');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
