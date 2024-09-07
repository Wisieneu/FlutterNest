import express from "express";

import * as userController from "../controllers/user.controller";
import * as authController from "../controllers/auth.controller";
import * as fileController from "../controllers/file.controller";
import { validateRegistrationData } from "../middlewares/user.validation.middleware";
import validatorMiddleware from "../middlewares/validation.middleware";

const userRouter = express.Router();

/**
 * General user routes
 */
userRouter.route("/").get(userController.getOneUser);
userRouter
  .route("/signup")
  .post(
    [...validateRegistrationData, validatorMiddleware],
    authController.signUp
  );

userRouter.route("/signin").post(authController.signIn);
userRouter.route("/logout").get(authController.logout);

userRouter
  .route("/authContext")
  .get(
    authController.attachUserToRequest,
    userController.returnAuthContextUser
  );

/**
 * Login protected routes
 */
userRouter.use(authController.restrictLoginAccess);

userRouter
  .route("/me")
  .get(userController.getMyAccount)
  .patch(userController.updateMyAccount)
  .delete(userController.deactivateAccount);

userRouter.route("/me/settings").get(userController.getMyAccountSettingsData);

userRouter.route("/me/pwChange").patch(userController.updateUserPassword);

userRouter
  .route("/me/profilePicture")
  .patch(
    fileController.uploadProfilePic,
    fileController.resizeUserPhoto,
    userController.updateUserProfilePicture
  );

/**
 * Admin routes - unsafe to be used by end users
 * could cause harm to the database if used by unauthorized users
 * these routes do not perform the necessary input validations
 * these routes might expose sensitive data
 */
userRouter.use(authController.restrictTo("admin"));

userRouter
  .route("/:userId")
  .patch(userController.updateUserById)
  .delete(userController.deleteOneUserById);

userRouter
  .route("/")
  .get(userController.getUsers)
  .post(userController.createUser);

export default userRouter;
