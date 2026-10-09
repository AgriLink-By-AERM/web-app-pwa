// Materialize saved MCP responses and download only their explicitly supplied asset URLs.
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../.figma-reference/archive');
async function main() {
  const report = [];
  for (const entry of await fs.readdir(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(root, entry.name);
    let response;
    try { response = JSON.parse(await fs.readFile(path.join(dir, 'response.json'), 'utf8')); } catch { continue; }
    const blocks = response.content || [];
    const text = blocks.filter(x => x.type === 'text').map(x => x.text).join('\n\n');
    await fs.writeFile(path.join(dir, 'context.txt'), text);
    let images = 0;
    for (const block of blocks.filter(x => x.type === 'image')) {
      await fs.writeFile(path.join(dir, `reference-${++images}.${block.mimeType === 'image/jpeg' ? 'jpg' : 'png'}`), Buffer.from(block.data, 'base64'));
    }
    const urls = new Set([...text.matchAll(/https:\/\/www\.figma\.com\/api\/mcp\/asset\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+/g)].map(x => x[0]));
    const prefix = text.match(/assetPathPrefix\s*=\s*"([^"]+)"/);
    if (prefix) for (const item of text.matchAll(/\$\{assetPathPrefix\}\/([a-zA-Z0-9_.-]+)/g)) urls.add(`${prefix[1]}/${item[1]}`);
    const assets = [];
    await fs.mkdir(path.join(dir, 'assets'), { recursive: true });
    const tasks = [...urls];
    let next = 0;
    await Promise.all(Array.from({ length: 6 }, async () => {
      while (next < tasks.length) {
        const url = tasks[next++];
        const filename = path.basename(new URL(url).pathname);
        const local = path.join(dir, 'assets', filename);
        try {
          let bytes;
          try { bytes = await fs.readFile(local); } catch {}
          if (!bytes?.length) {
            const res = await fetch(url, { signal: AbortSignal.timeout(45000) });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            bytes = Buffer.from(await res.arrayBuffer());
            if (!bytes.length || /text\/html/.test(res.headers.get('content-type') || '')) throw new Error('Empty or HTML asset');
            await fs.writeFile(local, bytes);
          }
          assets.push({ url, file: `assets/${filename}`, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') });
        } catch (error) { assets.push({ url, file: `assets/${filename}`, error: error.message }); }
      }
    }));
    await fs.writeFile(path.join(dir, 'assets.json'), JSON.stringify(assets, null, 2));
    const sparse = /sparse|too large|too big/i.test(text.slice(-7000)) && !/export default/.test(text);
    report.push({ id: entry.name.replace('-', ':'), error: !!response.isError, contextBytes: Buffer.byteLength(text), screenshots: images, sparse, assets: assets.length, missingAssets: assets.filter(x=>x.error).length });
    console.log(JSON.stringify(report[report.length-1]));
  }
  await fs.writeFile(path.join(root, 'verification.json'), JSON.stringify(report, null, 2));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
