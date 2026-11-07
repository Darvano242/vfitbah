// Tiny static server for render-frames.cjs: serves scripts/cine (barbell-scene.html) and node_modules/three.
const http=require('http'),fs=require('fs'),path=require('path');const root=process.argv[2];const port=+process.argv[3]||4231;
const T={'.js':'text/javascript','.html':'text/html'};
http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/'||p==='/scene.html')p='/barbell-scene.html';
 let f=p.startsWith('/node_modules/')?path.join(process.cwd(),p):path.join(root,p);if(p.includes('..')||!fs.existsSync(f)){r.writeHead(404);return r.end();}r.writeHead(200,{'content-type':T[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r);}).listen(port);
