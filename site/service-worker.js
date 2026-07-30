const CACHE_NAME='vfitness-shell-20260730-stability-1';
const STATIC_ASSETS=['/offline.html','/manifest.json','/icon-192.png','/icon-512.png','/favicon.png'];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache=>cache.addAll(STATIC_ASSETS))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('message',event=>{
  if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();
});

function networkFirst(request){
  return fetch(request).then(response=>{
    if(response&&response.ok){
      const copy=response.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));
    }
    return response;
  }).catch(()=>caches.match(request).then(cached=>cached||caches.match('/offline.html')));
}

function staleWhileRevalidate(request){
  return caches.match(request).then(cached=>{
    const network=fetch(request).then(response=>{
      if(response&&response.ok){
        const copy=response.clone();
        caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));
      }
      return response;
    }).catch(()=>cached);
    return cached||network;
  });
}

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;

  const isDocument=request.mode==='navigate'||request.destination==='document'||url.pathname==='/'||url.pathname.endsWith('.html');
  if(isDocument){
    event.respondWith(networkFirst(request));
    return;
  }

  const isStatic=['script','style','image','font'].includes(request.destination);
  if(isStatic){
    event.respondWith(staleWhileRevalidate(request));
  }
});
