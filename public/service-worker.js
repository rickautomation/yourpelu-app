const CACHE_NAME = "yourpelu-cache-v2";
const STATIC_ASSETS = ["/", "/manifest.json", "/Your.png"];

// Instalación: cachea solo assets estáticos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activación: limpia caches viejos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.map((n) => n !== CACHE_NAME && caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Ignorar la raíz
  if (req.url.endsWith("/")) return;

  // Solo manejar GET requests
  if (req.method !== "GET") return;

  // API → network-first
  if (req.url.includes("/api/")) {
    event.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  // Assets estáticos → cache-first
  event.respondWith(caches.match(req).then((cached) => cached || fetch(req)));
});