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

// Fetch: estrategia mixta
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Si es llamada a la API → network-first
  if (req.url.includes("/api/")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // opcional: cachear respuesta para offline
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req)) // si falla la red, usar cache
    );
    return;
  }

  // Para assets estáticos → cache-first
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});