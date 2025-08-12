import Video from "../models/videoModel.js";
import { generateUploadURL } from "../utils/generateSignedURL.js";

export async function uploadVideoRequest(req, res) {
  try {
    const { username, email, title, description, category, filetype } = req.body;

    // Validate required fields
    if (!username || !email || !title || !description || !category || !filetype) {
      return res.status(400).json({ message: 'All fields are required: username, email, title, description' });
    }

    // Create a new video document using save()
    const video = await Video.create({
      username,
      email,
      title,
      description,
      category
      // videoUrl, thumbnailUrl, and transcodeStatus will use default values
    });
    let url;
    console.log(video._id);
    try {
      url = await generateUploadURL(video._id, filetype);
    } catch (err) {
      console.error('Error generating pre-signed URL:', err);
      return res.status(500).json({ error: 'Could not generate upload url' });
    }
    console.log(url);
    res.status(201).json({
      message: 'Video entry created successfully',
      videoId: video._id,
      uploadUrl: url,
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


