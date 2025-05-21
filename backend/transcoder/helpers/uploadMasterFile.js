// helpers/uploadMasterFile.js
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
 * Generates and uploads a master.m3u8 file to the root of the given S3 prefix
 * @param {string} s3Prefix - like "public-videos/123456"
 */
export async function uploadMasterFile(s3Prefix) {
  const masterPlaylist = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=1280x720
720p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1920x1080
1080p/index.m3u8
`;

  const masterPath = path.join('outputs', 'master.m3u8');
  fs.writeFileSync(masterPath, masterPlaylist);

  const fileContent = fs.readFileSync(masterPath);

  const command = new PutObjectCommand({
    Bucket: process.env.PUBLIC_BUCKET_NAME,
    Key: `${s3Prefix}/master.m3u8`,
    Body: fileContent,
    ContentType: 'application/vnd.apple.mpegurl',
    ACL: 'public-read',
  });

  await s3.send(command);
  console.log(`✅ Uploaded master.m3u8 to ${s3Prefix}`);
}
