import Video from "../models/videoModel";



export async function getVideos (req, res){
  try {
    const completedVideos = await Video.find({ transcodeStatus: 'Completed' });

    res.status(200).json({
      message: 'Completed videos fetched successfully',
      videos: completedVideos,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



export async function getUserVideos(req, res) {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email query parameter is required' });
    }

    const userVideos = await Video.find({ email });

    res.status(200).json({
      message: 'Videos fetched for user',
      videos: userVideos,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

 

