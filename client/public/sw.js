// Service Worker pro VISIBLO Chat
const CACHE_NAME = 'visiblo-chat-v2';
const STATIC_CACHE = [
  '/',
  '/manifest.json',
  '/vite.svg'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_CACHE).catch((error) => {
        console.log('Cache addAll failed:', error);
      });
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Handle notifications
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  // Focus or open the app window
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Try to focus existing window first
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(self.location.origin)) {
          return client.focus();
        }
      }
      // Open new window if none found
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
});

// Simple fetch handler for offline support
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/') || event.request.url.includes('firebase')) {
    // Don't cache API calls or Firebase
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
