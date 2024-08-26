import { db, connection } from "../db";
import { likes, posts } from "../db/post/post.schema";

import logger from "../utils/logger";
import { findLike } from "../db/post/post.handlers";
import { users } from "../db/user/user.schema";
import { postMediaFiles } from "../db/postMediaFiles/post.media.files.schema";

const removeAllLikes = async () => {
  await db.delete(likes);
};

const getAllLikes = async () => {
  const likesArray = await db.select().from(likes);
  console.log(likesArray);
};

const insertLike = async () => {
  const result = await db
    .insert(likes)
    .values({
      userId: "5578d7c3-0ba2-4a17-a826-4760bf52d380",
      postId: "59a2cf23-bda4-49b3-8b29-d7b90164e2af",
    })
    .returning();
  return result;
};

const deleteAllPosts = async () => {
  await db.delete(posts);
};

const deleteAllUsers = async () => {
  await db.delete(users);
};

const deleteAllPostMediaFiles = async () => {
  await db.delete(postMediaFiles);
};

const clearAllDbTables = async () => {
  await deleteAllPosts();
  // await deleteAllUsers();
  await removeAllLikes();
  await deleteAllPostMediaFiles();
};

/**
 * This script is used for development purposes
 * It is not meant to be used in production
 * It is meant to be used for testing and debugging purposes
 * Just comment out the lines you don't need
 */
async function main() {
  logger.info("Starting script...");
  await clearAllDbTables();
  logger.info("Script finished");

  await connection.end();
}

main();
