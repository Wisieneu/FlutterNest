import { User } from '../db/user/user.schema';
import jwt from 'jsonwebtoken';

declare module 'express' {
  export interface Request {
    user?: User;
    fileSaveName?: string;
  }
  export interface Response {
    user?: User;
  }
}

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    userId: string;
  }
}
