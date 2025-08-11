import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
 * Generate a pre-signed URL for uploading a file to S3 with a given id as the filename.
 * @param {string} id - The unique ID from your database (used as filename/key).
 * @param {string} contentType - MIME type of the file.
 * @returns {Promise<{url: string, key: string}>}
 */
export async function generateUploadUrl(id, contentType) {
  const key = `uploads/${id}`; // Use the DB id as the filename/key

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes expiry

  return { url, key };
}


// Frontend tentative code 


// async function uploadVideo(file) {
//     const res = await fetch('http://localhost:4000/get-upload-url', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         filename: file.name,
//         filetype: file.type
//       })
//     });
  
//     const { uploadUrl } = await res.json();
  
//     const uploadRes = await fetch(uploadUrl, {
//       method: 'PUT',
//       headers: { 'Content-Type': file.type },
//       body: file
//     });
  
//     if (uploadRes.ok) alert('Upload successful!');
//     else alert('Upload failed');
//   }