// helpers/updateMetadata.js
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";


const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

const VIDEO_JSON_KEY = "video.json";

const streamToString = async (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
};

export const updateVideosInfo = async ({ videoId, title = "Untitled Video", bucket }) => {
  let videoData = [];

  try {
    const getCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: VIDEO_JSON_KEY,
    });

    const data = await s3.send(getCommand);
    const bodyString = await streamToString(data.Body);
    videoData = JSON.parse(bodyString);
  } catch (err) {
    if (err.name !== "NoSuchKey" && err.name !== "NotFound") {
      console.error("Error reading video.json:", err);
      throw err;
    }
    console.log("video.json not found, creating new one.");
  }

  const newVideoEntry = {
    id : videoId,
    title : title,
    url: `https://${bucket}.s3.amazonaws.com/public-videos/${videoId}/master.m3u8`,
    thumbnail: `https://${bucket}.s3.amazonaws.com/public-videos/${videoId}/thumbnail.jpg`,
    upload_time: new Date().toISOString(),
    uploader: "unknown", 
  };

  videoData.push(newVideoEntry);

  const putCommand = new PutObjectCommand({
    Bucket: bucket,
    Key: VIDEO_JSON_KEY,
    Body: JSON.stringify(videoData, null, 2),
    ContentType: "application/json",
  });

  try {
    await s3.send(putCommand);
    console.log("video.json updated successfully");
  } catch (err) {
    console.error("Failed to update video.json:", err);
    throw err;
  }
};