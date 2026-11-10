/* 땡땡이 service worker — caches everything on the first visit so the app also opens without internet (e.g. at the exhibition). */
const CACHE='ddaeng-v23';
const ASSETS=["assets/fonts/PretendardVariable.woff2", "assets/fonts/material-symbols-rounded-subset.woff2", "assets/fonts/material-symbols.css", "assets/fonts/pretendard.css", "assets/icons/apple-touch-icon.png", "assets/icons/icon-192.png", "assets/icons/icon-512.png","assets/icons/icon-square.svg","assets/icons/icon.svg", "assets/icons/icon-maskable-512.png", "assets/vendor/hangul.min.js", "assets/vendor/matter.min.js", "css/app.css", "index.html", "js/app.js", "manifest.webmanifest"];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./',...ASSETS])).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ const r=e.request; if(r.method!=='GET') return; const u=new URL(r.url); if(u.origin!==location.origin) return;
  if(r.mode==='navigate'){ e.respondWith(fetch(r).then(res=>{ const cp=res.clone(); caches.open(CACHE).then(c=>c.put('./',cp)); return res; }).catch(()=>caches.match('./').then(m=>m||caches.match('index.html')))); return; }
  e.respondWith(caches.match(r).then(m=>{ const net=fetch(r).then(res=>{ if(res&&res.ok){ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(r,cp)); } return res; }).catch(()=>m); return m||net; })); });
