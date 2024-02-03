import express from 'express';

import * as userController from '../controllers/user.controller';
import * as authController from '../controllers/auth.controller';

const router = express.Router();

// General routes
router.route('/signup').post(authController.signupUser);
router.route('/login').post(authController.loginUser);

// Login protected routes
router.use(authController.restrictLoginAccess);

router.route('/getMyAccount').get(userController.getMyAccount);
router.route('/updateMyAccount');
router.route('/deleteMyAccount');

// Admin routes
router.use(authController.restrictTo('ADMIN'));

router
  .route('/:userId')
  .get(userController.getOneUser)
  .patch(userController.updateOneUser)
  .delete(userController.deleteOneUser);
router
  .route('/')
  .get(userController.getUsers)
  .post(userController.createOneUser);

export default router;
