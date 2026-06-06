// Jed's AI OS — Service Worker
const CACHE = 'jed-ai-os-v1';
const STATIC = [
  '/dashboard/index.html',
  '/dashboard/style.css',
  '/dashboard/app.js',
  '/dashboard/images/Jed.png',
  '/dashboard/images/Laura.png',
  '/dashboard/images/Muse.png',
  '/dashboard/images/Atlas.png',
  '/dashboard/images/Nova.png',
  '/dashboard/images/Scout.png',
  '/dashboard/images/Council.png',
  '/dashboard/images/Forge.png',
  '/dashboard/images/Mint.png',
  '/dashboard/images/Sage.png',
  '/dashboard/images/vera.png',
];

// Install — cache static assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC))
  );
  self.skipWaiting();
});

// Activate — clear old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch strategy:
// - JSON data files → Network first (always fresh from GitHub)
// - Static assets → Cache first (fast load)
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // JSON data files — always fetch fresh from network
  if (url.pathname.includes('/output/') && url.pathname.endsWith('.json')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  // Static assets — cache first
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
