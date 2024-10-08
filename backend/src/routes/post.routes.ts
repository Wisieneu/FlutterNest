import express from "express";

import * as postController from "../controllers/post.controller";
import * as authController from "../controllers/auth.controller";
import {
  processPostMedia,
  uploadPostMedia,
} from "../controllers/file.controller";

const postRouter = express.Router();

/**
 * General post routes
 */
postRouter.use(authController.attachUserToRequest);

postRouter.route("/").get(postController.getPosts);
postRouter.route("/:postId").get(postController.getPost);

postRouter
  .route("/:postId/comments")
  .get(postController.getPostCommentsPaginated);

postRouter.get("/user/:userId", postController.getPostsByUserId);

postRouter.route("/likes/:userId").get(postController.getPostsLikedByUser);

/**
 * Login restricted routes only below this line
 */
postRouter.use(authController.restrictLoginAccess);

postRouter
  .route("/")
  .post(uploadPostMedia, processPostMedia, postController.createPost);

postRouter
  .route("/:postId/comments")
  .post(uploadPostMedia, processPostMedia, postController.commentPost);

postRouter.route("/:postId/reposts").post(postController.repostPost);

postRouter
  .route("/:postId")
  .patch(postController.updatePost)
  .delete(postController.deletePost);

postRouter.route("/:postId/like").post(postController.likePost);
postRouter.route("/:postId/unlike").delete(postController.unlikePost);
postRouter.get("/test/test", postController.test);
export default postRouter;
