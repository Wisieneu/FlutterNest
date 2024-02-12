import express from 'express';

import * as userController from '../controllers/user.controller';
import * as authController from '../controllers/auth.controller';
import { validateRegistrationData } from '../middlewares/user.validation.middleware';
import validatorMiddleware from '../middlewares/validation.middleware';

const userRouter = express.Router();
userRouter.get('', (req, res) => res.send('user endpoint'));

// General routes
userRouter
  .route('/signup')
  .post(
    [...validateRegistrationData, validatorMiddleware],
    authController.signUp
  );

userRouter.route('/login').post(authController.login);

// Login protected routes
userRouter.use(authController.restrictLoginAccess);

userRouter.route('/getMyAccount').get(userController.getMyAccount);
userRouter.route('/updateMyAccount').patch(userController.updateMyAccount);
userRouter.route('/deleteMyAccount').delete(userController.deleteMyAccount);

// Admin routes
userRouter.use(authController.restrictTo('admin'));

userRouter
  .route('/:userId')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteOneUser);
userRouter
  .route('/')
  .get(userController.getUsers)
  .post(userController.createUser);

export default userRouter;
