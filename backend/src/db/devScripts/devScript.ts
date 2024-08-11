import { db, connection } from '..';
import { likes } from 'db/post/post.schema';

import logger from '../../utils/logger';
import { findLike } from 'db/post/post.handlers';

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
      userId: '5578d7c3-0ba2-4a17-a826-4760bf52d380',
      postId: '59a2cf23-bda4-49b3-8b29-d7b90164e2af',
    })
    .returning();
  return result;
};

/**
 * This script is used for development purposes
 * It is not meant to be used in production
 * It is meant to be used for testing and debugging purposes
 * Just comment out the lines you don't need
 */
async function main() {
  logger.info('Starting script...');
  await removeAllLikes();
  logger.info('Removed all likes');
  const newLike = await insertLike();
  console.log({ newLike: newLike });
  await getAllLikes();
  const result = await findLike(
    '5578d7c3-0ba2-4a17-a826-4760bf52d380',
    '59a2cf23-bda4-49b3-8b29-d7b90164e2af'
  );
  console.log(result);
  logger.info('Script finished');

  await connection.end();
}

main();
