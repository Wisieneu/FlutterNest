import express from 'express';

import * as postController from '../controllers/post.controller';
import * as authController from '../controllers/auth.controller';

const postRouter = express.Router();

postRouter.use(authController.restrictLoginAccess);
postRouter
  .route('/')
  .get(postController.getPosts)
  .post(postController.createPost);

postRouter
  .route('/:id')
  .get(postController.getPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

export default postRouter;
