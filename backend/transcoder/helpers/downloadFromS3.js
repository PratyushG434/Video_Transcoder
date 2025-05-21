// downloads the video from s3 to local file
import fs from 'fs';
import path from 'path';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { pipeline } from 'stream/promises';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Downloads a file from S3 and saves it locally.
 * @param {string} key - S3 object key
 * @returns {Promise<string>} - Local file path
 */
export async function downloadFromS3(key) {
  const bucket = process.env.S3_BUCKET_NAME; // your temporary bucket

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const response = await s3.send(command);

  const localFilePath = path.join('downloads', 'input.mp4');

  await pipeline(response.Body, fs.createWriteStream(localFilePath));

  console.log(`✅ Downloaded ${key} to ${localFilePath}`);

  return localFilePath;
}
