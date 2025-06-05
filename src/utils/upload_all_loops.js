require('dotenv').config();
const path = require('path');
const fs = require('fs').promises;
const { uploadVideo, getVideoUrl } = require('./cloudinary');

const LOOPS_DIR = path.join(__dirname, '../assets/loops');
const OUTPUT_FILE = path.join(__dirname, '../assets/cloudinary_loop_urls.json');

async function uploadAllLoops() {
  try {
    // Read all MP4 files from the loops directory
    const files = await fs.readdir(LOOPS_DIR);
    const mp4Files = files.filter(file => file.endsWith('.mp4'));

    console.log(`Found ${mp4Files.length} loop files to upload`);

    // Upload each loop and collect results
    const results = {};
    for (const file of mp4Files) {
      const filePath = path.join(LOOPS_DIR, file);
      console.log(`Uploading ${file}...`);
      
      try {
        const result = await uploadVideo(filePath, {
          folder: 'hibernal-torment/loops',
          public_id: path.parse(file).name,
          resource_type: 'video',
          chunk_size: 6000000, // 6MB chunks
          eager: [
            { format: "mp4", quality: "auto" },
            { format: "webm", quality: "auto" }
          ],
          eager_async: true
        });

        results[file] = {
          url: getVideoUrl(result.public_id),
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
uploadAllLoops(); 