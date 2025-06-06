const cloudinary = require('../../cloudinary.config.js');
const fs = require('fs');
const path = require('path');

async function uploadHeaders() {
    const headers = [
        { file: 'viewerHeader.png', public_id: 'hibernal-torment/skins/viewerHeader' },
        { file: 'messageHeader.png', public_id: 'hibernal-torment/skins/messageHeader' }
    ];

    for (const header of headers) {
        try {
            const filePath = path.join(__dirname, '../../assets/skins', header.file);
            
            // Check if file exists
            if (!fs.existsSync(filePath)) {
                console.error(`File not found: ${filePath}`);
                continue;
            }

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(filePath, {
                public_id: header.public_id,
                resource_type: 'image'
            });

            console.log(`Uploaded ${header.file}:`, result.secure_url);
        } catch (error) {
            console.error(`Error uploading ${header.file}:`, error);
        }
    }
}

uploadHeaders().catch(console.error); 