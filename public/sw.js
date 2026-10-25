const CACHE_NAME = 'demba-offline-dhotel-v2';
const STATIC_ASSETS = [
  '/',
  '/login',
  '/manifest.json',
  '/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Pré-mise en cache SW partielle D-HOTEL:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || !url.protocol.startsWith('http')) return;

  if (url.pathname.startsWith('/api/')) return;

  // 1. Navigation requests (Pages HTML) : Network-First avec repli Cache Shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
              if (url.pathname !== '/' && url.pathname !== '/login') {
                cache.put('/', response.clone());
              }
            });
          }
          return response;
        })
        .catch(async () => {
          const cookieHeader = request.headers.get('cookie') || '';
          const isOfflineActive = cookieHeader.includes('demba_offline_active=1');
          const isDashboardTarget = url.pathname !== '/' && url.pathname !== '/login';

          const cached = await caches.match(request);
          if (cached && (!cached.redirected || isDashboardTarget)) {
            return cached;
          }

          if (isDashboardTarget || isOfflineActive) {
            const fallbackDashboard = await caches.match('/');
            if (fallbackDashboard && !fallbackDashboard.redirected) {
              return fallbackDashboard;
            }

            const fallbackLogin = await caches.match('/login');
            if (fallbackLogin) return fallbackLogin;
          }

          return new Response(
            '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>D-HOTEL Hors-Ligne</title><style>body{font-family:sans-serif;background:#0F1B2B;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center}h1{color:#D4AF37}</style></head><body><div><h1>D-HOTEL Hors-Ligne</h1><p>Vérifiez votre connexion Internet ou reconnectez-vous avec vos identifiants mémorisés.</p><a href="/" style="color:#D4AF37;text-decoration:none;font-weight:bold">Réessayer</a></div></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  // 2. Static Assets (_next/static, css, js, fonts, images) : Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
