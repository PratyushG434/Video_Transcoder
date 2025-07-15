import Video from "../models/videoModel";

export async function updateVideoTranscodeStatus(videoId, newStatus){
  try {
    
    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { transcodeStatus: newStatus },
      { new: true } // return the updated document
    );

    if (!updatedVideo) {
      throw new Error('Video not found');
    }

    return updatedVideo;
  } catch (err) {
    // You can log the error or rethrow it based on your use case
    console.error('Error updating transcode status:', err.message);
    throw err; // Let the caller handle the error
  }
};



export async function updateVideoDetails (videoId, newStatus, videoUrl, thumbnailUrl){
  try {
    // Build update object
    const updateFields = {
      transcodeStatus : newStatus,
      videoUrl : videoUrl,
      thumbnailUrl : thumbnailUrl
    };

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      updateFields,
      { new: true }
    );

    if (!updatedVideo) {
      throw new Error('Video not found');
    }

    return updatedVideo;
  } catch (err) {
    console.error('Error updating video details:', err.message);
    throw err;
  }
};



