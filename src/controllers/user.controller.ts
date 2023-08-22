// import pg from 'pg';
import { Request, Response } from 'express';
// import { User } from '../models/user.model.js';

// const UserModel: User =

// TODO:
export const getUsers = async (req: Request, res: Response) => {
  // res.status(200).json({
  //   status: 'success',
  // });
};

export const getOneUser = async (req: Request, res: Response) => {
  // User.findOne({ req.params.userId })
  res.status(200).json({
    status: 'success',
  });
};

export const createUser = async (req: Request, res: Response) => {
  // User.
  res.status(200).json({
    status: 'success',
  });
};
