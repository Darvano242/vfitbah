const CACHE_NAME='vfitness-shell-v20260720-recovery-v1';

self.addEventListener('install',event=>{
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
      .then(()=>self.clients.matchAll({type:'window'}))
      .then(clients=>clients.forEach(client=>client.postMessage({type:'VFITNESS_CACHE_RESET'})))
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(
    fetch(event.request,{cache:'no-store'}).catch(()=>{
      if(event.request.mode==='navigate')return caches.match('/offline.html');
      return Response.error();
    })
  );
});
