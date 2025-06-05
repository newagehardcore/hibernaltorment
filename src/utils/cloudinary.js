require('dotenv').config();
const cloudinary = require('../../cloudinary.config');

/**
 * Upload a video to Cloudinary
 * @param {string} videoPath - Path to the video file
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Upload result
 */
async function uploadVideo(videoPath, options = {}) {
  try {
    const result = await cloudinary.uploader.upload(videoPath, {
      resource_type: "video",
      chunk_size: 6000000, // 6MB chunks
      eager: [
        { format: "mp4", quality: "auto" },
        { format: "webm", quality: "auto" }
      ],
      eager_async: true,
      ...options
    });
    return result;
  } catch (error) {
    console.error('Error uploading video to Cloudinary:', error);
    throw error;
  }
}

/**
 * Get video URL with specific transformations
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {string} - Transformed video URL
 */
function getVideoUrl(publicId, options = {}) {
  return cloudinary.url(publicId, {
    resource_type: "video",
    ...options
  });
}

module.exports = {
  uploadVideo,
  getVideoUrl
}; 