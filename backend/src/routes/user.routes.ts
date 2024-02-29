import express from 'express';

import * as userController from '../controllers/user.controller';
import * as authController from '../controllers/auth.controller';
import { validateRegistrationData } from '../middlewares/user.validation.middleware';
import validatorMiddleware from '../middlewares/validation.middleware';
import * as fileController from '../controllers/file.controller';

const userRouter = express.Router();

/**
 * General user routes
 */
userRouter
  .route('/signup')
  .post(
    [...validateRegistrationData, validatorMiddleware],
    authController.signUp
  );

userRouter.route('/login').post(authController.login);
userRouter.route('/logout').get(authController.logout);

userRouter.route('/u/:username').get(userController.getUserProfile);

/**
 * Login protected routes
 */
userRouter.use(authController.restrictLoginAccess);

userRouter.route('/getMyAccount').get(userController.getMyAccount);
userRouter.route('/updateMyAccount').patch(userController.updateMyAccount);
userRouter.route('/deactivateAccount').patch(userController.deactivateAccount);
userRouter.route('/deleteAccount').delete(userController.deleteAccount);

userRouter
  .route('/uploadProfilePicture')
  .patch(
    fileController.uploadProfilePic,
    fileController.resizeUserPhoto,
    userController.updateUserPhoto
  );

/**
 * Admin routes - unsafe to be used by end users
 * could cause harm to the database if used by unauthorized users
 * these routes do not perform the necessary input validations
 * these routes might expose sensitive data
 */
userRouter.use(authController.restrictTo('admin'));

userRouter
  .route('/:userId')
  .patch(userController.updateUser)
  .delete(userController.deleteOneUser);
userRouter
  .route('/')
  .get(userController.getUsers)
  .post(userController.createUser);

export default userRouter;
