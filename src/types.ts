import { User } from '@prisma/client';
import { Request as expressRequest } from 'express';

export interface Request extends expressRequest {
  user?: User;
}
