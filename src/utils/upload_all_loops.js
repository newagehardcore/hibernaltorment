require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { uploadVideo } = require('./cloudinary');

const loopsDir = path.join(__dirname, '../assets/loops');

async function uploadAllLoops() {
  const files = fs.readdirSync(loopsDir).filter(f => f.endsWith('.mp4'));
  console.log(`Found ${files.length} MP4 files to upload`);
  
  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    const filePath = path.join(loopsDir, file);
    console.log(`\nUploading ${file}...`);
    try {
      const result = await uploadVideo(filePath, { 
        public_id: path.parse(file).name,
        resource_type: "video",
        chunk_size: 6000000, // 6MB chunks
        eager: [
          { format: "mp4", quality: "auto" },
          { format: "webm", quality: "auto" }
        ],
        eager_async: true
      });
      
      console.log(`✅ Successfully uploaded: ${file}`);
      console.log(`   URL: ${result.secure_url}`);
      console.log(`   Public ID: ${result.public_id}`);
      console.log(`   Format: ${result.format}`);
      console.log(`   Size: ${(result.bytes / 1024 / 1024).toFixed(2)}MB`);
      
      results.push({
        file,
        status: 'success',
        url: result.secure_url,
        public_id: result.public_id
      });
      successCount++;
    } catch (err) {
      console.error(`❌ Failed to upload ${file}:`, err.message);
      results.push({
        file,
        status: 'failed',
        error: err.message
      });
      failCount++;
    }
  }

  // Print summary
  console.log('\n=== Upload Summary ===');
  console.log(`Total files: ${files.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  
  // Save results to a JSON file
  const resultsPath = path.join(__dirname, '../assets/cloudinary_urls.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to: ${resultsPath}`);

  return results;
}

uploadAllLoops().catch(console.error); 