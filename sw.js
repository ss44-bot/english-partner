/* English Partner — Service Worker (آفلاین‌سازی پوسته‌ی اپ) */
const CACHE = 'ep-shell-v3';
const SHELL = [
  './', './index.html', './styles.css',
  './js/data.js', './js/bookdata.js', './js/prompts.js', './js/ai.js', './js/app.js', './js/extra.js',
  './icon-180.png', './icon-512.png',
  './manifest.webmanifest', './icon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  // درخواست‌های API و دامنه‌های بیرونی: هیچ دخالتی نمی‌کنیم
  if (req.method !== 'GET' || url.origin !== location.origin) return;

  // پوسته‌ی اپ: اول کش، بعد شبکه (سریع و آفلاین‌پذیر)
  e.respondWith(
    caches.match(req).then(hit =>
      hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('./index.html'))
    )
  );
});
