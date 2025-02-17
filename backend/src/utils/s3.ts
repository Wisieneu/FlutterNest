import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client([
  {
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  },
]);

export async function uploadFileToS3(
  file: Express.Multer.File,
  customFileName?: string
) {
  return await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: customFileName || file.filename,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    })
  );
}

export async function getFileFromS3(fileKey: string) {
  const { Body } = await s3Client.send(
    new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    })
  );
  return Body;
}

export async function deleteFileFromS3(fileKey: string) {
  return await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    })
  );
}
