import express from 'express';

import * as postController from '../controllers/post.controller';
import * as authController from '../controllers/auth.controller';
import { uploadPostMedia } from '../controllers/file.controller';

const postRouter = express.Router();

/**
 * General post routes
 */
postRouter.route('/').get(postController.getPosts);
postRouter.route('/:postId').get(postController.getPost);

// Login restricted routes from now on
postRouter.use(authController.restrictLoginAccess);

postRouter.route('/').post(uploadPostMedia, postController.createPost('post'));
postRouter.route('/:postId/comment').post(postController.createPost('comment'));
postRouter.route('/:postId/repost').post(postController.createPost('repost'));

postRouter
  .route('/:postId')
  .patch(postController.updatePost)
  .delete(postController.deletePost);

postRouter.route('/:postId/like').post(postController.togglePostLike);

export default postRouter;
