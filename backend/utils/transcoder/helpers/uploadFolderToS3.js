// helpers/uploadFolderToS3.js
import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
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
 * Uploads all files in a local folder to a given S3 path.
 * @param {string} folderPath - Local path like "outputs"
 * @param {string} s3Prefix - S3 folder path like "public-videos/123456"
 */
export async function uploadFolderToS3(folderPath, s3Prefix) {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const fileContent = fs.readFileSync(filePath);

    const command = new PutObjectCommand({
      Bucket: process.env.PUBLIC_BUCKET_NAME,       
      Key: `${s3Prefix}/${file}`,
      Body: fileContent,
      ContentType: file.endsWith('.ts') ? 'video/MP2T' : 'application/vnd.apple.mpegurl',
      ACL: 'bucket-owner-full-control', // Make the files public
    });

    await s3.send(command);
    console.log(`✅ Uploaded ${file} to ${s3Prefix}`);
  }
}
