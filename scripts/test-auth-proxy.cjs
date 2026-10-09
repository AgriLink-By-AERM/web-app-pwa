const assert = require('node:assert/strict');
const http = require('node:http');
const { proxyApi } = require('./proxy-api.cjs');
const listen = server => new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(`http://127.0.0.1:${server.address().port}`)));
(async () => {
  let observed;
  const upstream = http.createServer((req,res) => { let body='';req.on('data',part=>body+=part);req.on('end',()=>{observed={url:req.url,cookie:req.headers.cookie,body};res.writeHead(200,{'Content-Type':'application/json','Set-Cookie':['accessToken=new; HttpOnly; Path=/; SameSite=Lax','refreshToken=rotated; HttpOnly; Path=/; SameSite=Strict']});res.end('{"success":true}');}); });
  const base = await listen(upstream);
  const proxy = http.createServer((req,res)=>proxyApi(req,res,base));
  try {
    const url=await listen(proxy);
    const response=await fetch(url+'/api/v1/auth/refresh-token?test=1',{method:'POST',headers:{Cookie:'refreshToken=old','Content-Type':'application/json'},body:'{}'});
    assert.equal(response.status,200);assert.equal(response.headers.getSetCookie().length,2);assert.equal(response.headers.get('cache-control'),'private, no-store');
    assert.deepEqual(observed,{url:'/api/v1/auth/refresh-token?test=1',cookie:'refreshToken=old',body:'{}'});
    const blocked=await fetch(url+'/api/v1/auth/logout',{method:'POST',headers:{Origin:'https://unrelated.example'}});assert.equal(blocked.status,403);
    console.log('PASS proxy preserves cookies, rotation headers, body, query and no-store; rejects unrelated origins');
  } finally { proxy.closeAllConnections();upstream.closeAllConnections();await Promise.all([new Promise(r=>proxy.close(r)),new Promise(r=>upstream.close(r))]); }
})().catch(error=>{console.error(error);process.exitCode=1;});
