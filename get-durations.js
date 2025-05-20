const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const musicDir = './music';

fs.readdir(musicDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.filter(file => file.endsWith('.mp3')).forEach(file => {
        const filePath = path.join(musicDir, file);
        exec(`afinfo "${filePath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error getting info for ${file}:`, error);
                return;
            }
            const durationMatch = stdout.match(/estimated duration: (\d+\.\d+)/);
            if (durationMatch) {
                console.log(`${file}: ${durationMatch[1]}`);
            }
        });
    });
}); 