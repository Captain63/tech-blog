const FILES_TO_CACHE = [
    '/manifest.webmanifest',
    '/css/style.css',
    '/css/normalize.css',
    '/js/dist/edit.min.js',
    '/js/dist/login.min.js',
    '/js/dist/logout.min.js',
    '/js/dist/post.min.js',
    '/js/dist/search.min.js',
    '/js/dist/signup.min.js',
    '/js/dist/validate.min.js',
    '/images/desktop-favicon.png',
    '/images/icon-192x192.png',
    '/images/icon-512x512.png'
];

const STATIC_CACHE = "static-cache";
const RUNTIME_CACHE = "runtime-cache";
  
self.addEventListener("install", event => {
    event.waitUntil(
      caches
        .open(STATIC_CACHE)
        .then(cache => cache.addAll(FILES_TO_CACHE))
        .then(() => self.skipWaiting())
    );
});
  
// The activate handler takes care of cleaning up old caches.
self.addEventListener("activate", event => {
    const currentCaches = [STATIC_CACHE, RUNTIME_CACHE];
    event.waitUntil(
      caches
        .keys()
        .then(cacheNames => {
          // return array of cache names that are old to delete
          return cacheNames.filter(
            cacheName => !currentCaches.includes(cacheName)
          );
        })
        .then(cachesToDelete => {
          return Promise.all(
            cachesToDelete.map(cacheToDelete => {
              return caches.delete(cacheToDelete);
            })
          );
        })
        .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    // Fixes bug when auditing in DevTools Lighthouss
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;

    // use cache first for all other requests for performance
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        // If not cached, send network request
        } else {
            return fetch(event.request);
        }
      })
    )
});