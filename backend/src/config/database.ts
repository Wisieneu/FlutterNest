import { Request } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import AppError from '../utils/appError';

dotenv.config({ path: './.env' });

export const database = new PrismaClient().$extends({
  model: {
    user: {
      async signUp(
        email: string,
        username: string,
        password: string,
        passwordConfirm: string
      ) {
        if (password !== passwordConfirm) {
          throw new AppError('Provided passwords do not match.', 400);
        }
        const hash = await bcrypt.hash(password, 10);
        const newUser = await database.user.create({
          data: {
            email,
            username,
            password: hash,
            displayName: username,
          },
        });
        return newUser;
      },

      async updatePassword(
        password: string,
        passwordConfirm: string,
        req: Request
      ) {},

      async checkPassword<User>(candidatePassword: string) {
        // return await bcrypt.compare(candidatePassword, this.password);
      },
    },
  },
});

// console.clear();
console.log(
  `\n✅\x1b[33m PostgreSQL database connection has been established successfully\x1b[0m`
);
