import { S3Client , DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from "dotenv";


dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Deletes a file from S3.
 * @param {string} key - S3 object key
 * @returns {Promise<void>}
 */
export async function deleteFromTempS3(key) {
  const bucket = process.env.S3_BUCKET_NAME;

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    await s3.send(command);
    console.log(`Deleted ${key} from S3 bucket ${bucket}`);
  } catch (err) {
    console.error(`Failed to delete ${key} from S3:`, err);
    throw err;
  }
}