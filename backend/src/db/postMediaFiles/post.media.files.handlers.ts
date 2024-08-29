import { eq, inArray, sql } from "drizzle-orm";
import { postMediaFiles } from "./post.media.files.schema";
import { db } from "..";
import { uploadFileToS3 } from "../../utils/s3";
import { Post } from "db/post/post.schema";

const getPostMediaFilesByPostIdQuery = db
  .select()
  .from(postMediaFiles)
  .where(eq(postMediaFiles.postId, sql.placeholder("postId")))
  .prepare("getPostMediaFilesByPostId");

export async function getPostMediaFilesByPostId(postId: string) {
  const result = await getPostMediaFilesByPostIdQuery.execute({ postId });
  return result;
}

export async function getPostMediaFilesByPostIdsArray(postIdsArray: string[]) {
  /**
   * TODO: this cannot be replaced with a prepared query statement
   * array cannot be used as a placeholder, throws a syntax error
   * https://github.com/drizzle-team/drizzle-orm/issues/2872
   */
  const result = await db
    .select()
    .from(postMediaFiles)
    .where(inArray(postMediaFiles.postId, postIdsArray));

  return result;
}

export async function populatePostObjectWithMediaFilesManually(
  postsArray: Omit<Post, "media">[]
): Promise<Post[]> {
  const postIdsArray = postsArray.map((post) => post.id);
  const postMediaFiles = await getPostMediaFilesByPostIdsArray(postIdsArray);
  const result: Post[] = postsArray.map((post) => {
    const postMedia = postMediaFiles.filter(
      (postMedia) => postMedia.postId === post.id
    );
    return { ...post, media: [...postMedia] };
  });
  console.log(result);
  return result;
}

export async function insertPostMediaFiles(
  filesArray: Express.Multer.File[],
  postId: string,
  authorId: string
) {
  filesArray.forEach(async (file, index) => {
    const fileName = `${postId}_${authorId}_${index}_.jpeg`;
    await uploadFileToS3(file, fileName);
  });

  const mappedFilesArray = filesArray.map((file, index) => {
    return {
      postId,
      authorId,
      mimetype: file.mimetype,
      fileSize: String(file.size),
      fileName: `${postId}_${authorId}_${index}_.jpeg`,
    };
  });

  const result = await db
    .insert(postMediaFiles)
    .values(mappedFilesArray)
    .returning();

  return result;
}

// TODO: implement
export async function deletePostMediaFiles(postId: string) {
  // remove all files from S3, do not delete db entries
}
