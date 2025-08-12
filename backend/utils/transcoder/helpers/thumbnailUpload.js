import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();
const execAsync = util.promisify(exec);

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Generates and uploads a thumbnail to the root of the video folder in S3.
 * @param {string} localVideoPath - Full path to the downloaded video
 * @param {string} s3Prefix - S3 prefix like "public-videos/123456"
 */
export async function uploadThumbnail(localVideoPath, s3Prefix) {
  const thumbnailPath = path.join('outputs', 'thumbnail.jpg');

  // Generate thumbnail at 5th second
  const cmd = `ffmpeg -i ${localVideoPath} -ss 00:00:05.000 -vframes 1 ${thumbnailPath}`;
  console.log('🖼️  Generating thumbnail...');
  await execAsync(cmd);
  console.log('✅ Thumbnail generated');

  const fileContent = fs.readFileSync(thumbnailPath);

  const command = new PutObjectCommand({
    Bucket: process.env.PUBLIC_BUCKET_NAME,
    Key: `${s3Prefix}/thumbnail.jpg`,
    Body: fileContent,
    ContentType: 'image/jpeg',
    // ACL: 'public-read',
  });

  await s3.send(command);
  console.log(`🚀 Thumbnail uploaded to ${s3Prefix}/thumbnail.jpg`);

  fs.unlinkSync(thumbnailPath);
  console.log('🧼 Local thumbnail removed');
}
