const http=require('http');
const fs=require('fs');
const path=require('path');

const root=path.resolve(process.argv[2]||path.join(process.cwd(),'site'));
const port=Number(process.env.PORT||4173);
const types={
  '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg',
  '.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2'
};

function safeFile(urlPath){
  const clean=decodeURIComponent((urlPath||'/').split('?')[0]).replace(/\\/g,'/');
  const relative=clean.replace(/^\/+/, '');
  const resolved=path.resolve(root,relative);
  return resolved.startsWith(root)?resolved:null;
}

http.createServer((req,res)=>{
  let file=safeFile(req.url);
  if(file&&fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile())file=path.join(root,'index.html');
  const ext=path.extname(file).toLowerCase();
  res.statusCode=200;
  res.setHeader('Content-Type',types[ext]||'application/octet-stream');
  res.setHeader('Cache-Control','no-store');
  fs.createReadStream(file).on('error',()=>{res.statusCode=500;res.end('Server error');}).pipe(res);
}).listen(port,'127.0.0.1',()=>console.log('VFitness test server listening on '+port));
