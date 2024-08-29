import express from "express";

import * as postController from "../controllers/post.controller";
import * as authController from "../controllers/auth.controller";
import {
  processPostMedia,
  uploadPostMedia,
} from "../controllers/file.controller";

const postRouter = express.Router();

import multer from "multer";

/**
 * General post routes
 */

postRouter.route("/").get(postController.getPosts);
postRouter.route("/:postId").get(postController.getPost);

/**
 * Login restricted routes only below this line
 */
postRouter.use(authController.restrictLoginAccess);

postRouter
  .route("/")
  .post(uploadPostMedia, processPostMedia, postController.createPost);

// postRouter.route('/').post(uploadPostMedia, postController.test);
postRouter
  .route("/:postId/comments")
  .get(postController.getPostCommentsPaginated)
  .post(uploadPostMedia, processPostMedia, postController.commentPost);

postRouter.route("/:postId/reposts").post(postController.repostPost);

postRouter
  .route("/:postId")
  .patch(postController.updatePost)
  .delete(postController.deletePost);

postRouter.route("/:postId/like").post(postController.likePost);
postRouter.route("/:postId/unlike").post(postController.unlikePost);

postRouter.get("/user/:userId", postController.getPostsByUserId);

export default postRouter;
