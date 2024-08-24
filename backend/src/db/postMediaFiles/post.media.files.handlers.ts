import { eq, sql } from "drizzle-orm";
import { postMediaFiles } from "./post.media.files.schema";
import { db } from "..";
import { uploadFileToS3 } from "../../utils/s3";

const getPostMediaFilesByPostIdQuery = db
  .select()
  .from(postMediaFiles)
  .where(eq(postMediaFiles.postId, sql.placeholder("postId")))
  .prepare("getPostMediaFilesByPostId");

export async function getPostMediaFilesByPostId(postId: string) {
  const result = await getPostMediaFilesByPostIdQuery.execute({ postId });
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
