const cloudinary = require('cloudinary').v2;

// Check for environment variables
if (!process.env.CLOUDINARY_URL) {
    console.error('CLOUDINARY_URL environment variable is required');
    process.exit(1);
}

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
    process.exit(1);
}

module.exports = cloudinary; 