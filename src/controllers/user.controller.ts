import { Response } from 'express';

import { Request } from '../types';
import { database } from '../config/database';

export const getUsers = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const users = await database.user.findMany({});
  return res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
};

export const getOneUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const user = database.user.findFirstOrThrow({
    where: { id: req.params.userId },
  });
  return res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};

export const createOneUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const newUser = await database.user.create({
    data: req.body,
  });
  return res.status(201).json({
    status: 'success',
    data: {
      newUser,
    },
  });
};

export const updateOneUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const updatedUser = database.user.update({
    where: {
      id: req.params.userId,
    },
    data: req.body,
  });
  return res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
};

export const deleteOneUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const deletedUser = database.user.delete({
    where: {
      id: req.params.id,
    },
  });
  return res.status(200).json({
    status: 'success',
    data: {
      deletedUser,
    },
  });
};

export const getMyAccount = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const user = await database.user.findFirstOrThrow({
    where: {
      id: req.user!.id,
    },
  });
  return res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};
