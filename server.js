const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm',
  '.wsz': 'application/octet-stream'
};

const server = http.createServer((req, res) => {
  // Parse the URL properly
  const parsedUrl = url.parse(req.url);
  
  // Decode the pathname to handle spaces and special characters
  const pathname = decodeURIComponent(parsedUrl.pathname);
  
  // Handle the root path and special cases
  let filePath;
  if (pathname === '/') {
    filePath = path.join(__dirname, 'src', 'index.html');
  } else if (pathname === '/GKSkin.wsz') {
    // Special case for the skin file
    filePath = path.join(__dirname, 'src', 'assets', 'skins', 'GKSkin.wsz');
  } else {
    // For all other paths, try to serve from src directory
    filePath = path.join(__dirname, pathname.startsWith('/src/') ? pathname : path.join('src', pathname));
  }
  
  // Get the file extension
  const extname = path.extname(filePath);
  
  // Default content type is text/plain
  let contentType = MIME_TYPES[extname] || 'text/plain';
  
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Content-Type': contentType
  };
  
  // Special handling for binary files (mp3, wsz, gif)
  const isBinary = ['.mp3', '.wsz', '.woff', '.ttf', '.eot', '.otf', '.gif', '.png', '.jpg', '.jpeg'].includes(extname);
  
  // Check if file exists before trying to read it
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }
    
    if (isBinary) {
      // Use streams for large binary files
      const stream = fs.createReadStream(filePath);
      stream.on('error', (error) => {
        console.error(`Error reading file ${filePath}:`, error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${error.code}`);
      });
      
      res.writeHead(200, headers);
      stream.pipe(res);
    } else {
      fs.readFile(filePath, 'utf8', (error, content) => {
        if (error) {
          console.error(`Error reading file ${filePath}:`, error);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end(`Server Error: ${error.code}`);
        } else {
          res.writeHead(200, headers);
          res.end(content);
        }
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Open your browser to this URL to see the Webamp player`);
}); 