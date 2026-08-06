const CACHE_PREFIX='vfitness-';
const CACHE_NAME=CACHE_PREFIX+'shell-v20260806-programs1';
const STATIC_ASSETS=[
  '/offline.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/vfit-redesign.css',
  '/vf-online-programs.css',
  '/vf-online-programs.js'
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache=>Promise.allSettled(STATIC_ASSETS.map(asset=>cache.add(asset))))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE_NAME).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('message',event=>{
  if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();
});

function isNavigation(request){
  return request.mode==='navigate'||(request.headers.get('accept')||'').includes('text/html');
}

function isFreshCode(url){
  return /\.(?:html?|js|css|json)$/i.test(url.pathname)||url.pathname==='/'||url.pathname==='/manifest.json';
}

function isCacheableMedia(url){
  return /\.(?:png|jpe?g|webp|gif|svg|ico|woff2?)$/i.test(url.pathname);
}

function upgradeHtml(html){
  let upgraded=html
    .replace(/if\(!\$\('\.vfit-ai-fab'\)\)\{\s*const b=document\.createElement\('button'\);\s*b\.className='vfit-ai-fab';\s*b\.textContent='Ask Coach';\s*b\.setAttribute\('data-vfit-ai','open'\);\s*document\.body\.appendChild\(b\);\s*\}/g,'')
    .replace(/React\.createElement\(\"a\",\{href:VF_WA_LINK,target:\"_blank\",rel:\"noopener noreferrer\",className:\"flex-1 text-center px-4 py-3 rounded-xl font-bold text-white\",style:\{background:'rgba\(37,211,102,\.14\)',border:'1px solid rgba\(37,211,102,\.4\)',color:'#4ade80'\}\},\"Ask Coach D\"\),?/g,'')
    .replace(/<button[^>]*class=["'][^"']*vfit-ai-fab[^"']*["'][^>]*>[\s\S]*?<\/button>/gi,'');

  if(!upgraded.includes('/vfit-redesign.css')){
    upgraded=upgraded.replace('</head>','<link rel="stylesheet" href="/vfit-redesign.css?v=20260806-programs1"></head>');
  }
  if(!upgraded.includes('/vf-online-programs.css')){
    upgraded=upgraded.replace('</head>','<link rel="stylesheet" href="/vf-online-programs.css?v=20260806-programs1"></head>');
  }
  if(!upgraded.includes('/vf-online-programs.js')){
    upgraded=upgraded.replace('</body>','<script defer src="/vf-online-programs.js?v=20260806-programs1"></script></body>');
  }
  return upgraded;
}

async function networkHtml(request){
  const response=await fetch(request,{cache:'no-store'});
  const contentType=response.headers.get('content-type')||'';
  if(!response.ok||!contentType.includes('text/html'))return response;

  const html=upgradeHtml(await response.text());
  const headers=new Headers(response.headers);
  headers.delete('content-length');
  headers.set('cache-control','no-store, no-cache, must-revalidate');
  return new Response(html,{status:response.status,statusText:response.statusText,headers});
}

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;

  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.startsWith('/api/'))return;

  if(isNavigation(request)){
    event.respondWith(networkHtml(request).catch(()=>caches.match('/offline.html')));
    return;
  }

  if(isFreshCode(url)){
    event.respondWith(fetch(request,{cache:'no-store'}).catch(()=>caches.match(request)));
    return;
  }

  if(isCacheableMedia(url)){
    event.respondWith(
      caches.match(request).then(cached=>{
        const network=fetch(request).then(response=>{
          if(response&&response.ok){
            const copy=response.clone();
            caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));
          }
          return response;
        }).catch(()=>cached);
        return cached||network;
      })
    );
  }
});
