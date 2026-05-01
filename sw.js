const CACHE_NAME = 'wijnkelder-v1';
const ASSETS = [
  '/wijnkelder/',
  '/wijnkelder/index.html',
  '/wijnkelder/manifest.json',
  '/wijnkelder/icon-192.png',
  '/wijnkelder/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('supabase.co') || e.request.url.includes('anthropic.com') || e.request.url.includes('fonts.googleapis')) {
    return; // Don't cache API calls
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
