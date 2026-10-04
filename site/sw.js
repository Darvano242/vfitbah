const CACHE_PREFIX = 'vfitness-shell-';
const CACHE_NAME = CACHE_PREFIX + 'v20261004';
const PUBLIC_ASSETS = ['/offline.html', '/manifest.json', '/icon-192.png', '/icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PUBLIC_ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys
    .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
    .map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || /^\/api(?:\/|$)/.test(url.pathname)) return;
  // Never persist API responses, application routes, auth links, or query strings.
  const publicAsset = !url.search && PUBLIC_ASSETS.includes(url.pathname);
  if (request.mode !== 'navigate' && !publicAsset) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (publicAsset && response.ok) {
        try {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        } catch (_) { /* Cache quota errors must not discard a network success. */ }
      }
      return response;
    } catch (_) {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request.mode === 'navigate' ? '/offline.html' : request);
      return cached || Response.error();
    }
  })());
});
