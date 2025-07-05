// Simple service worker without external connections
const CACHE_NAME = "siqueira-campos-v1.0.0";

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker instalado");
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker ativado");
  event.waitUntil(clients.claim());
});

// Fetch event - pass through all requests without caching external URLs
self.addEventListener("fetch", (event) => {
  // Skip external URLs and just pass them through
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(fetch(event.request));
});
