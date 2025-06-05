require('dotenv').config();
const cloudinary = require('../../cloudinary.config');
const path = require('path');

async function testCloudinaryConnection() {
  try {
    // Debug: Log the current working directory and .env file location
    console.log('Current working directory:', process.cwd());
    console.log('.env file should be at:', path.join(process.cwd(), '.env'));
    
    // Log the environment variable (with sensitive parts redacted)
    const url = process.env.CLOUDINARY_URL;
    if (!url) {
      console.error('CLOUDINARY_URL is not set in environment variables');
      return false;
    }

    const redactedUrl = url.replace(/(?<=cloudinary:\/\/)[^:]+(?=:)/, '***')
                         .replace(/(?<=:)[^@]+(?=@)/, '***');
    console.log('Using Cloudinary URL:', redactedUrl);

    // Parse and verify the URL components
    const matches = url.match(/cloudinary:\/\/([^:]+):([^@]+)@([^/]+)/);
    if (!matches) {
      console.error('Invalid CLOUDINARY_URL format');
      return false;
    }

    const [, apiKey, apiSecret, cloudName] = matches;
    console.log('Cloud name:', cloudName);
    console.log('API Key length:', apiKey.length);
    console.log('API Secret length:', apiSecret.length);

    // Try to get account info
    console.log('Attempting to connect to Cloudinary...');
    const result = await cloudinary.api.ping();
    console.log('Cloudinary connection successful!');
    console.log('Account info:', result);
    
    return true;
  } catch (error) {
    console.error('Cloudinary connection failed:', error.message);
    console.error('Full error:', error);
    if (error.http_code === 401) {
      console.error('Authentication failed. Please check your API key and secret.');
    }
    return false;
  }
}

testCloudinaryConnection(); 