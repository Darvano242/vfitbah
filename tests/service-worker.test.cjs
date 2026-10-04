const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function worker(fetchImpl = async () => { throw new Error('offline'); }) {
  const events={}, deleted=[], stored=[];
  const offline=new Response('<html>Offline</html>', { headers: { 'Content-Type':'text/html' } });
  const cache={ addAll: async () => {}, put:async (key) => stored.push(key), match:async key => key==='/offline.html'?offline:undefined };
  const context={URL,Response,fetch:fetchImpl,self:{location:{origin:'https://www.vfitbah.com'},addEventListener:(name,fn)=>events[name]=fn,skipWaiting:async()=>{},clients:{claim:async()=>{}}},caches:{open:async()=>cache,keys:async()=>['vfitness-shell-old','unrelated-cache','vfitness-shell-v20261004'],delete:async key=>deleted.push(key)}};
  vm.runInNewContext(fs.readFileSync(require.resolve('../site/sw.js'),'utf8'),context);
  return {events,deleted,stored,offline};
}
function event(path,mode='cors') { return { request:{url:'https://www.vfitbah.com'+path,method:'GET',mode}, respondWith(promise){this.promise=promise;},waitUntil(promise){this.promise=promise;} }; }
test('API, private assets, auth queries and external requests are not intercepted',()=>{
  const w=worker();
  for(const path of ['/api/application','/progress-photo.jpg','/icon-192.png?token=secret']){const e=event(path);w.events.fetch(e);assert.equal(e.promise,undefined);}
  const e=event('/icon-192.png');e.request.url='https://external.example/icon-192.png';w.events.fetch(e);assert.equal(e.promise,undefined);
});
test('offline navigation gets offline HTML without caching an application route',async()=>{
  const w=worker();const e=event('/dashboard?token=secret','navigate');w.events.fetch(e);assert.equal(await e.promise,w.offline);assert.equal(w.stored.length,0);
});
test('an unavailable static asset never receives HTML',async()=>{
  const w=worker();const e=event('/icon-192.png');w.events.fetch(e);const response=await e.promise;assert.equal(response.type,'error');
});
test('only explicit public assets are cached',async()=>{
  const w=worker(async()=>new Response('image'));const e=event('/icon-192.png');w.events.fetch(e);await e.promise;assert.equal(w.stored.length,1);
  const nav=event('/dashboard','navigate');w.events.fetch(nav);await nav.promise;assert.equal(w.stored.length,1);
});
test('activation removes only obsolete VFIT caches',async()=>{
  const w=worker();const e={waitUntil(p){this.promise=p;}};w.events.activate(e);await e.promise;assert.deepEqual(w.deleted,['vfitness-shell-old']);
});
test('API navigation is never replaced with the offline page',()=>{
  const w=worker();const e=event('/api/application','navigate');w.events.fetch(e);assert.equal(e.promise,undefined);
});
