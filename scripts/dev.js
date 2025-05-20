const { spawn } = require('child_process');
const fkill = require('fkill').default;
const open = require('open');
const path = require('path');

const PORT = 3000;
const SERVER_URL = `http://localhost:${PORT}`;

async function startDev() {
    try {
        // Kill any existing processes on port 3000
        console.log('Stopping any existing servers on port 3000...');
        await fkill(`:${PORT}`, { force: true, silent: true }).catch(() => {});
        
        // Start the server
        console.log('Starting server...');
        const serverPath = path.join(__dirname, '..', 'server.js');
        const server = spawn('node', [serverPath], {
            stdio: 'inherit'
        });

        // Handle server process
        server.on('error', (err) => {
            console.error('Failed to start server:', err);
            process.exit(1);
        });

        // Wait a bit for the server to start
        setTimeout(async () => {
            try {
                console.log(`Opening browser at ${SERVER_URL}`);
                await open(SERVER_URL);
            } catch (err) {
                console.error('Failed to open browser:', err);
            }
        }, 1000);

        // Handle cleanup on exit
        process.on('SIGINT', () => {
            server.kill();
            process.exit();
        });
    } catch (err) {
        console.error('Error in dev script:', err);
        process.exit(1);
    }
}

startDev(); 