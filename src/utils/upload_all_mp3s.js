const fs = require('fs').promises;
const path = require('path');
const { uploadAudio, getAudioUrl } = require('./cloudinary');

const MUSIC_DIR = path.join(__dirname, '../assets/music');
const OUTPUT_FILE = path.join(__dirname, '../assets/cloudinary_audio_urls.json');

async function uploadAllMP3s() {
  try {
    // Read all MP3 files from the music directory
    const files = await fs.readdir(MUSIC_DIR);
    const mp3Files = files.filter(file => file.endsWith('.mp3'));

    console.log(`Found ${mp3Files.length} MP3 files to upload`);

    // Upload each MP3 and collect results
    const results = {};
    for (const file of mp3Files) {
      const filePath = path.join(MUSIC_DIR, file);
      console.log(`Uploading ${file}...`);
      
      try {
        const result = await uploadAudio(filePath, {
          folder: 'hibernal-torment/audio',
          public_id: path.parse(file).name,
          resource_type: 'auto'
        });

        results[file] = {
          url: getAudioUrl(result.public_id),
          public_id: result.public_id
        };

        console.log(`Successfully uploaded ${file}`);
      } catch (error) {
        console.error(`Failed to upload ${file}:`, error);
      }
    }

    // Save results to JSON file
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(results, null, 2));
    console.log(`\nUpload complete! Results saved to ${OUTPUT_FILE}`);

    // Print summary
    console.log('\nUpload Summary:');
    console.log('---------------');
    Object.keys(results).forEach(file => {
      console.log(`${file}: ${results[file].url}`);
    });

  } catch (error) {
    console.error('Error in upload process:', error);
  }
}

// Run the upload process
uploadAllMP3s(); 