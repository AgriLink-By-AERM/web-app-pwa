// Serve the static export on localhost, matching the development API cookie host.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../out');
const port = Number(process.argv[2] || 3004);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Provide a valid port.');
if (!fs.existsSync(path.join(root, 'index.html'))) throw new Error('Build the app before starting the preview.');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain' };
http.createServer((req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' });
    const stream = fs.createReadStream(file); stream.on('error', () => res.destroy()); stream.pipe(res);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); }
}).listen(port, 'localhost', () => console.log(`Farmtry preview: http://localhost:${port}`));
