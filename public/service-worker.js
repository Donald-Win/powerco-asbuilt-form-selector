// service-worker.js
// Auto-updating service worker for Powerco Forms App

const CACHE_VERSION = 'v2.0.2'; // Increment this to force cache refresh
const CACHE_NAME = `powerco-forms-${CACHE_VERSION}`;

// Files to cache for offline use (app shell)
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json'
  // Vite builds assets with hashes, so they auto-bust cache
];

// Network-first strategy for forms (always get latest)
const FORMS_PATTERN = /\/forms\/.*\.pdf$/;

// Install event - cache app shell
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell');
      return cache.addAll(APP_SHELL);
    }).then(() => {
      // Force immediate activation
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('powerco-forms-') && name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - network-first for forms, cache-first for app
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Network-first for PDF forms (always get latest)
  if (FORMS_PATTERN.test(request.url)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the fresh form
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cached version if offline
          return caches.match(request);
        })
    );
    return;
  }
  
  // Network-first for API/data requests
  if (request.url.includes('/api/') || request.method !== 'GET') {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }
  
  // Cache-first for static assets (with network fallback)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version, but fetch in background to update
        fetch(request).then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response);
            });
          }
        }).catch(() => {});
        
        return cachedResponse;
      }
      
      // Not in cache, fetch from network
      return fetch(request).then((response) => {
        if (response.ok && request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      });
    })
  );
});

// Listen for messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING message');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CHECK_UPDATE') {
    // Force update check
    console.log('[SW] Checking for updates...');
    self.registration.update();
  }
});
