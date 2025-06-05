const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

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

const BINARY_EXTENSIONS = new Set([
  '.mp3', '.wsz', '.woff', '.ttf', '.eot', '.otf', 
  '.gif', '.png', '.jpg', '.jpeg'
]);

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET'
};

function handleError(res, statusCode, message) {
  console.error(message);
  res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
  res.end(message);
}

function serveFile(filePath, res) {
  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || 'text/plain';
  const headers = { ...CORS_HEADERS, 'Content-Type': contentType };

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return handleError(res, 404, `File not found: ${filePath}`);
    }

    if (BINARY_EXTENSIONS.has(extname)) {
      const stream = fs.createReadStream(filePath);
      stream.on('error', (error) => {
        handleError(res, 500, `Error reading file ${filePath}: ${error.code}`);
      });
      res.writeHead(200, headers);
      stream.pipe(res);
    } else {
      fs.readFile(filePath, 'utf8', (error, content) => {
        if (error) {
          handleError(res, 500, `Error reading file ${filePath}: ${error.code}`);
        } else {
          res.writeHead(200, headers);
          res.end(content);
        }
      });
    }
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const pathname = decodeURIComponent(parsedUrl.pathname);
  
  let filePath;
  if (pathname === '/') {
    filePath = path.join(__dirname, 'src', 'index.html');
  } else if (pathname === '/GKSkin.wsz') {
    filePath = path.join(__dirname, 'src', 'assets', 'skins', 'GKSkin.wsz');
  } else {
    filePath = path.join(__dirname, pathname.startsWith('/src/') ? pathname : path.join('src', pathname));
  }
  
  serveFile(filePath, res);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Open your browser to this URL to see the Webamp player');
}); 