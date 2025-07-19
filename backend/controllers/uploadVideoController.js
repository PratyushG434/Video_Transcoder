import Video from "../models/videoModel.js";

export async function uploadVideoRequest(req, res){
  try {
    const { username, email, title, description } = req.body;

    // Validate required fields
    if (!username || !email || !title || !description) {
      return res.status(400).json({ message: 'All fields are required: username, email, title, description' });
    }

    // Create a new video document using save()
    const video = new Video.create({
      username,
      email,
      title,
      description,
      // videoUrl, thumbnailUrl, and transcodeStatus will use default values
    });

     

    res.status(201).json({
      message: 'Video entry created successfully',
      videoId: video._id,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


