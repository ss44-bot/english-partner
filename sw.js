/* English Partner — offline app shell, refreshed whenever online. */
const CACHE = 'ep-shell-v4';
const SHELL = [
  './', './index.html', './styles.css',
  './js/data.js', './js/bookdata.js', './js/prompts.js', './js/ai.js', './js/app.js', './js/extra.js',
  './icon-180.png', './icon-512.png', './manifest.webmanifest', './icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE)
    .then(cache => cache.addAll(SHELL))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith('ep-shell-') && key !== CACHE)
      .map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Never cache API responses, missing files, or HTML under JavaScript URLs.
  const shellURLs = SHELL.map(path => new URL(path, self.registration.scope).href);
  if (request.mode !== 'navigate' && !shellURLs.includes(url.href)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request, { cache: 'no-cache' });
      if (response.ok) await cache.put(request, response.clone());
      return response;
    } catch {
      const cached = await cache.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        const index = await cache.match('./index.html');
        if (index) return index;
      }
      return Response.error();
    }
  })());
});
