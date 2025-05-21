import { downloadFromS3 } from './helpers/downloadFromS3';
import { uploadFolderToS3 } from './helpers/uploadFolderToS3';
import { uploadMasterFile } from './helpers/uploadMasterFile';
import { uploadThumbnail } from './helpers/thumbnailUpload';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

// Make sure folders exist
['downloads', 'outputs'].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

const renditions = [
  { name: '360p', width: 640, height: 360, bitrate: 800000 },
  { name: '720p', width: 1280, height: 720, bitrate: 1400000 },
  { name: '1080p', width: 1920, height: 1080, bitrate: 2800000 },
];

export async function transcodeVideo(inputKey) {
  try {
    console.log(`🔁 Starting transcoding for ${inputKey}...`);

    const localInputPath = await downloadFromS3(inputKey);
    const videoId = Date.now();
    const s3Prefix = `public-videos/${videoId}`;

    for (const rendition of renditions) {
      const { name, width, height } = rendition;
      const outputDir = path.join('outputs', name);
      const outputPath = path.join(outputDir, 'index.m3u8');

      // Create output subdirectory
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const cmd = `ffmpeg -i ${localInputPath} -vf scale=${width}:${height} -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -b:v ${rendition.bitrate} -maxrate ${rendition.bitrate} -bufsize ${rendition.bitrate * 2} -hls_time 10 -hls_segment_filename "${outputDir}/segment_%03d.ts" -hls_playlist_type vod ${outputPath}`;

      console.log(`🎬 Transcoding ${name}...`);
      await execAsync(cmd);
      console.log(`✅ ${name} transcoding done.`);

      // Upload to S3
      await uploadFolderToS3(outputDir, `${s3Prefix}/${name}`);

      // for removing the files after uploading into s3
      fs.rmSync(outputDir, { recursive: true, force: true });
      console.log(`🧼 Cleaned local folder: ${outputDir}`);
    }
    
    await uploadMasterFile(s3Prefix);
    await uploadThumbnail(localInputPath, s3Prefix);

    fs.rmSync('downloads', { recursive: true, force: true });
    console.log('🧼 Cleaned downloads folder');

    ///// here the code for updating video.js with s3Prefix and video title

  } catch (err) {
    console.error(`❌ FFmpeg failed for ${inputKey}:`, err);
    throw err;
  }
}
