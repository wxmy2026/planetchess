const C='planetchess-v18';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','og.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim();});
// 试玩版（preview/）不缓存；页面本身「有网先取新版，没网用缓存」；图标等小文件缓存优先
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin||u.pathname.indexOf('/preview/')>=0)return;
  const page=e.request.mode==='navigate'||/\/(index\.html)?$/.test(u.pathname);
  if(page){e.respondWith(fetch(e.request).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put('index.html',cp));return res;}).catch(()=>caches.match('index.html')));return;}
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request)));
});
