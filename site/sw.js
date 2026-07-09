const CACHE_NAME='vfitness-shell-v20260709-bse-premium-home-v1';
const APP_SHELL=['/','/index.html','/offline.html','/manifest.json','/icon-192.png','/icon-512.png','/hero-bg.jpg','/hero-2026.jpg','/program-home30.jpg','/program-flex.jpg','/program-hourglass.jpg','/program-booty.jpg','/program-ironbeast.jpg','/program-shred.jpg','/program-foundation.jpg','/program-strong40.jpg','/program-upperbody.jpg','/program-sixpack.jpg','/program-mass.jpg','/program-athlete.jpg','/vf-bse-premium-home.css','/vf-bse-premium-home.js'];
const PREMIUM_CSS='<link rel="stylesheet" href="/vf-bse-premium-home.css?v=20260709-bse1">';
const PREMIUM_JS='<script defer src="/vf-bse-premium-home.js?v=20260709-bse1"></script>';
function shouldInject(request,response){
  if(request.method!=='GET'||!response||!response.ok)return false;
  const url=new URL(request.url);
  if(url.origin!==location.origin)return false;
  const type=response.headers.get('content-type')||'';
  return type.includes('text/html')&&(url.pathname==='/'||url.pathname==='/index.html');
}
async function injectPremiumHome(request,response){
  if(!shouldInject(request,response))return response;
  let html=await response.text();
  if(!html.includes('/vf-bse-premium-home.css'))html=html.replace('</head>',`${PREMIUM_CSS}\n${PREMIUM_JS}\n</head>`);
  return new Response(html,{status:response.status,statusText:response.statusText,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
}
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(
    fetch(event.request)
      .then(async response=>{
        const transformed=await injectPremiumHome(event.request,response.clone());
        if(response.ok&&new URL(event.request.url).origin===location.origin){caches.open(CACHE_NAME).then(cache=>cache.put(event.request,response.clone()));}
        return transformed;
      })
      .catch(()=>caches.match(event.request).then(async cached=>cached?injectPremiumHome(event.request,cached):caches.match('/offline.html')))
  );
});