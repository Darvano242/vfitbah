const CACHE_PREFIX='vfitness-';
const CACHE_NAME=CACHE_PREFIX+'shell-v20260730-qa1';
const STATIC_ASSETS=[
  '/offline.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png'
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

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;

  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.startsWith('/api/'))return;

  if(isNavigation(request)||isFreshCode(url)){
    event.respondWith(
      fetch(request,{cache:'no-store'})
        .then(response=>response)
        .catch(()=>isNavigation(request)?caches.match('/offline.html'):caches.match(request))
    );
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
