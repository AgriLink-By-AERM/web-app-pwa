const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const root=process.argv[2];
const kiwi=require(path.join(root,'tools/package'));
const data=fs.readFileSync(path.join(root,'canvas.fig'));
if(data.toString('ascii',0,8)!=='fig-kiwi')throw Error('Invalid Figma signature');
let offset=12;const chunks=[];
while(offset<data.length){const size=data.readUInt32LE(offset);offset+=4;if(offset+size>data.length)throw Error('Truncated chunk');chunks.push(data.subarray(offset,offset+size));offset+=size;}
const unpack=b=>b.readUInt32LE(0)===0xfd2fb528?zlib.zstdDecompressSync(b):zlib.inflateRawSync(b);
const schema=kiwi.decodeBinarySchema(unpack(chunks[0]));
const compiled=kiwi.compileSchema(schema);
const decoded=compiled.decodeMessage(unpack(chunks[1]));
fs.writeFileSync(path.join(root,'schema.json'),JSON.stringify(schema));
fs.writeFileSync(path.join(root,'document.json'),JSON.stringify(decoded,(_,v)=>v instanceof Uint8Array?{encoding:'base64',data:Buffer.from(v).toString('base64')}:typeof v==='bigint'?v.toString():v));
const nodes=decoded.nodeChanges||[];
console.log(JSON.stringify({version:data.readUInt32LE(8),chunks:chunks.length,keys:Object.keys(decoded),nodes:nodes.length,sample:nodes.slice(0,3)},null,2));
