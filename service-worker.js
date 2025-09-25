self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('magic-dice-v1').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './style.css',
        './dice.js',
        './three.min.js',
        './dice-icon.png',
        './manifest.json'
      ]);
    })
  );
  self.skipWaiting();
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});