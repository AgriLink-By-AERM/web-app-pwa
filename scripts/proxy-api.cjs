const http = require('node:http');
const https = require('node:https');
// Fixed upstream, never derived from user input. Preserve every Set-Cookie header separately.
function proxyApi(req, res, upstream = process.env.FARMTRY_API_UPSTREAM || 'https://farmtry-core-engine.onrender.com') {
  const target = new URL(upstream);
  const origin = req.headers.origin;
  if (origin && origin !== `http://${req.headers.host}`) { res.writeHead(403); return res.end(); }
  const headers = { accept: 'application/json' };
  for (const name of ['cookie', 'content-type', 'content-length', 'origin']) if (req.headers[name]) headers[name] = req.headers[name];
  const transport = target.protocol === 'https:' ? https : http;
  const request = transport.request({ hostname: target.hostname, port: target.port, protocol: target.protocol, method: req.method, path: req.url, headers }, response => {
    if (response.statusCode >= 300 && response.statusCode < 400) { response.resume(); res.writeHead(502); return res.end('Unexpected API redirect'); }
    const output = { 'Cache-Control': 'private, no-store', 'Content-Type': response.headers['content-type'] || 'application/json' };
    for (const name of ['set-cookie', 'retry-after']) if (response.headers[name]) output[name] = response.headers[name];
    res.writeHead(response.statusCode, output);
    response.on('error', () => res.destroy());
    response.pipe(res);
  });
  request.setTimeout(20000, () => request.destroy(new Error('API timeout')));
  request.on('error', () => { if (!res.headersSent) res.writeHead(502, { 'Cache-Control': 'no-store' }); res.end(); });
  req.on('aborted', () => request.destroy());
  req.pipe(request);
}
module.exports = { proxyApi };
