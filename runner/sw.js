/* SHIFT — النموذج · نسخة de2b5ee0 */
/* **السياسة نفسها** التي في نسخة النشر (`build-site.mjs`): مخزَّن أولاً وتحديث في
   الخلفية. لا سياسة جديدة — نُقلت كما هي ليبقى سلوك التعافي واحداً. */
const CACHE = 'shift-runner-de2b5ee0';
const FILES = ['./', './index.html', './manifest.webmanifest',
  './favicon.ico', './apple-touch-icon.png', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(hit => {
    const net = fetch(e.request).then(res => {
      if (res && res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
      return res;
    }).catch(() => hit);            /* بلا شبكة: النسخة المخزّنة هي الجواب */
    return hit || net;              /* المخزّن أولاً، والتحديث في الخلفية */
  }));
});
