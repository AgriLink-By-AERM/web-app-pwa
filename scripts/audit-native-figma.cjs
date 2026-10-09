const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=process.argv[2], archive=path.dirname(root);
const doc=JSON.parse(fs.readFileSync(path.join(root,'document.json'),'utf8'));
const id=g=>g?`${g.sessionID}:${g.localID}`:null;
const nodes=doc.nodeChanges, byId=new Map(nodes.map(n=>[id(n.guid),n]));
const children=new Map();
for(const n of nodes){const p=id(n.parentIndex?.guid);if(p){if(!children.has(p))children.set(p,[]);children.get(p).push(id(n.guid));}}
const targets=JSON.parse(fs.readFileSync(path.join(archive,'inventory.json'),'utf8'));
const checks=[];fs.mkdirSync(path.join(root,'screens'),{recursive:true});
for(const t of targets){const node=byId.get(t.id);const collected=[],seen=new Set();
 const visit=nid=>{if(seen.has(nid))return;seen.add(nid);const n=byId.get(nid);if(n)collected.push(n);for(const c of children.get(nid)||[])visit(c);};
 if(node){visit(t.id);fs.writeFileSync(path.join(root,'screens',t.id.replace(':','-')+'.json'),JSON.stringify({source:'FarmTry.fig',id:t.id,name:node.name,nodes:collected,sharedBlobs:'../document.json#blobs'}));}
 checks.push({id:t.id,name:t.name,found:!!node,actualName:node?.name,descendants:collected.length});
}
const metadataChecks=[];
for(const file of ['file-metadata.json','11-16198-metadata.json','181-2715-metadata.json']){
 const response=JSON.parse(fs.readFileSync(path.join(archive,file),'utf8'));
 const xml=response.content.filter(c=>c.type==='text').map(c=>c.text).join('\n');
 const ids=[...new Set([...xml.matchAll(/\bid="(\d+:\d+)"/g)].map(m=>m[1]))];
 metadataChecks.push({file,ids:ids.length,missing:ids.filter(x=>!byId.has(x))});
}
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const imageFiles=fs.readdirSync(path.join(root,'images')).map(name=>({name,bytes:fs.statSync(path.join(root,'images',name)).size,sha256:sha(path.join(root,'images',name))}));
const report={verifiedAt:new Date().toISOString(),sourceFile:'C:/Users/HP/Documents/Agrilink/FarmTry.fig',backupSha256:sha(path.join(root,'FarmTry.fig')),sourceSha256:sha('C:/Users/HP/Documents/Agrilink/FarmTry.fig'),originFileKey:doc.originFileKey,nodes:nodes.length,blobs:doc.blobs?.length,pages:nodes.filter(n=>n.type==='CANVAS').map(n=>({id:id(n.guid),name:n.name,internalOnly:!!n.internalOnly})),targets:targets.length,targetsFound:checks.filter(c=>c.found).length,missingTargets:checks.filter(c=>!c.found),metadataChecks,embeddedImages:imageFiles.length,emptyImages:imageFiles.filter(x=>!x.bytes),screens:checks,images:imageFiles};
report.inventoryComplete=report.targets===report.targetsFound&&metadataChecks.every(m=>!m.missing.length)&&!report.emptyImages.length&&report.backupSha256===report.sourceSha256;
fs.writeFileSync(path.join(root,'verification.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,screens:undefined,images:undefined},null,2));
