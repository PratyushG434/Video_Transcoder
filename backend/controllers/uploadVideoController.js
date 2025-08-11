import Video from "../models/videoModel.js";

export async function uploadVideoRequest(req, res){
  try {
    const { username, email, title, description , category, filetype } = req.body;

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

     const = 

    res.status(201).json({
      message: 'Video entry created successfully',
      videoId: video._id,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


