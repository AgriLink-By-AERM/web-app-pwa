const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../.figma-reference/archive');
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function main() {
  let native; try { native = JSON.parse(await fs.readFile(path.join(root, 'native-2026-10-07/verification.json'), 'utf8')); } catch {}
  const inventory = JSON.parse(await fs.readFile(path.join(root, 'inventory.json'), 'utf8'));
  const index = await fs.readFile(path.resolve(__dirname, '../docs/REPOSITORY_AND_DESIGN_INDEX.md'), 'utf8');
  const indexed = [...index.matchAll(/^\|[^\n]+\| (\d+:\d+) \|/gm)].map(x=>x[1]);
  const rows = [];
  for (const item of inventory) {
    const folder = item.id.replace(':','-');
    let response, assets = [];
    try { response = JSON.parse(await fs.readFile(path.join(root, folder, 'response.json'), 'utf8')); } catch {}
    try { assets = JSON.parse(await fs.readFile(path.join(root, folder, 'assets.json'), 'utf8')); } catch {}
    const content = response?.content?.filter(x=>x.type==='text').map(x=>x.text).join('\n') || '';
    let screenshot = false;
    try { const png = await fs.readFile(path.join(root,folder,'reference-1.png')); screenshot = png.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) && png.readUInt32BE(16)>0 && png.readUInt32BE(20)>0; } catch {}
    let verifiedAssets = 0;
    for (const asset of assets) {
      if (asset.error) continue;
      try { const bytes = await fs.readFile(path.join(root,folder,asset.file)); if (bytes.length && crypto.createHash('sha256').update(bytes).digest('hex')===asset.sha256) verifiedAssets++; } catch {}
    }
    const fullContext = !response?.isError && /export default/.test(content);
    rows.push({...item, folder, fullContext, screenshot, assets:assets.length, verifiedAssets, ready:!!fullContext&&screenshot&&assets.length===verifiedAssets, status:response?.isError?'connector-limit':fullContext?'captured':'not-captured'});
  }
  const missingFromInventory = indexed.filter(id=>!inventory.some(x=>x.id===id));
  const summary = {capturedAt:new Date().toISOString(), expected:rows.length, currentTopLevel:rows.filter(x=>x.page==='current'&&!x.parentBoard).length, previousTopLevel:rows.filter(x=>x.page==='previous').length, nested:rows.filter(x=>x.parentBoard).length, ready:rows.filter(x=>x.ready).length, pending:rows.filter(x=>!x.ready).length, assets:rows.reduce((n,x)=>n+x.verifiedAssets,0), missingFromInventory, complete:rows.every(x=>x.ready)&&!missingFromInventory.length};
  summary.nativeArchiveComplete = native?.inventoryComplete === true; summary.nativeTargetsFound = native?.targetsFound || 0;
  await fs.writeFile(path.join(root,'audit.json'),JSON.stringify({summary,rows},null,2));
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Farmtry offline design archive</title><style>body{font:16px system-ui;background:#f5f7f4;color:#193321;margin:32px}header{max-width:1000px}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px}article{background:white;padding:16px;border:1px solid #ccd5ca;border-radius:12px}img{width:100%;height:300px;object-fit:contain;background:#eee}small{display:block}a{color:#176334}.pending{color:#963817}</style></head><body><header><h1>Farmtry offline design archive</h1><p><strong>${summary.nativeArchiveComplete?'Native archive complete — individual screenshot extraction remains partial':summary.complete?'Complete':'PARTIAL — implementation remains paused'}</strong></p><p>${summary.ready} of ${summary.expected} screens/boards/components verified. ${summary.assets} local assets verified. Previous designs are historical references. Screenshots are reference material, never frontend assets.</p></header><main>${rows.map(r=>`<article><small>${escape(r.page)} ${r.parentBoard?'· nested':''} · ${escape(r.id)}</small><h2>${escape(r.name.replace(/&amp;/g,'&'))}</h2><p class="${r.ready?'':'pending'}">${r.ready?'Saved and verified':escape(r.status)}</p>${r.screenshot?`<a href="${r.folder}/reference-1.png"><img loading="lazy" src="${r.folder}/reference-1.png" alt="${escape(r.name)}"></a>`:''}${r.fullContext?`<p><a href="${r.folder}/context.txt">Layout and text reference</a> · <a href="${r.folder}/assets.json">Asset mapping</a></p>`:''}<small>${r.width} × ${r.height} · ${r.verifiedAssets}/${r.assets} assets</small></article>`).join('')}</main></body></html>`;
  await fs.writeFile(path.join(root,'index.html'),html);
  console.log(JSON.stringify(summary,null,2));
}
main().catch(error=>{console.error(error);process.exitCode=1});
