const CACHE_NAME="wordstep-20260901-4";
const SHELL=["./","./index.html","./styles.css","./app-20260901-4.js","./enhancements-20260901-4.js","./manifest.webmanifest","./icon.svg","./icon-32.png","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./apple-touch-icon.png","./version.json"];
const DATA=["./words-data.js","./cefr-levels.js"];
const NAVIGATION_TIMEOUT=2200;
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE_NAME).then(async cache=>{
  await cache.addAll(SHELL);
  await Promise.allSettled(DATA.map(asset=>cache.add(asset)));
}).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener("message",event=>{if(event.data?.type==="SKIP_WAITING")self.skipWaiting()});
self.addEventListener("fetch",event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=="GET"||url.origin!==self.location.origin)return;
  if(url.pathname.endsWith("/version.json")){
    event.respondWith(fetch(request,{cache:"no-store"}).catch(()=>caches.match("./version.json")));
    return;
  }
  if(request.mode==="navigate"){
    const network=fetch(request).then(response=>{if(response.ok)caches.open(CACHE_NAME).then(cache=>cache.put("./index.html",response.clone()));return response});
    if(url.searchParams.get("source")==="pwa"){
      event.respondWith(caches.open(CACHE_NAME).then(cache=>cache.match("./index.html")).then(cached=>cached||network).catch(()=>network));
      event.waitUntil(network.catch(()=>{}));
      return;
    }
    const timeout=new Promise((_,reject)=>setTimeout(()=>reject(new Error("navigation timeout")),NAVIGATION_TIMEOUT));
    event.respondWith(Promise.race([network,timeout]).catch(()=>caches.open(CACHE_NAME).then(cache=>cache.match("./index.html"))));
    event.waitUntil(network.catch(()=>{}));
    return;
  }
  if(url.pathname.endsWith("/words-data.js")||url.pathname.endsWith("/cefr-levels.js")){
    event.respondWith(caches.open(CACHE_NAME).then(async cache=>{
      const cached=await cache.match(url.pathname.endsWith("/words-data.js")?"./words-data.js":"./cefr-levels.js");
      if(cached)return cached;
      const response=await fetch(request);
      if(response.ok)await cache.put(url.pathname.endsWith("/words-data.js")?"./words-data.js":"./cefr-levels.js",response.clone());
      return response;
    }));
    return;
  }
  event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,copy))}return response}).catch(()=>caches.match(request,{ignoreSearch:true})));
});
