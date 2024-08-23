import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3() as any;

export async function uploadFileToS3(
  file: Express.Multer.File,
  customFileName?: string
) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: customFileName || file.filename,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  return await s3.upload(params).promise();
}

export async function getFileFromS3(fileKey: string) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileKey,
  };

  return await s3.getObject(params).promise();
}

export async function deleteFileFromS3(fileKey: string) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileKey,
  };

  return await s3.deleteObject(params).promise();
}
