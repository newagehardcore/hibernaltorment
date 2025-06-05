const cloudinary = require('cloudinary').v2;

// Parse the CLOUDINARY_URL into individual components
const cloudinaryUrl = process.env.CLOUDINARY_URL;
const matches = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@([^/]+)/);

if (matches) {
  const [, apiKey, apiSecret, cloudName] = matches;
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });
} else {
  console.error('Invalid CLOUDINARY_URL format');
}

module.exports = cloudinary; 