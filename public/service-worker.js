const CACHE_NAME = "yourpelu-cache-v4"; // <--- Cambia la versión cuando hagas cambios estructurales
const STATIC_ASSETS = ["/workspace", "/manifest.json", "/Your.png"];

// Instalación
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  // Fuerza al SW entrante a convertirse en el SW activo
  self.skipWaiting();
});

// Activación: Borra inmediatamente versiones viejas y toma el control
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((n) => {
          if (n !== CACHE_NAME) {
            return caches.delete(n);
          }
        })
      )
    ).then(() => self.clients.claim()) // Toma control inmediato de todas las pestañas/instancias de la PWA
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Ignorar peticiones no GET o externas
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;

  // Estrategia Network-First para APIs
  if (req.url.includes("/api/")) {
    event.respondWith(
      fetch(req)
        .then((response) => {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return response;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Estrategia Stale-While-Revalidate para páginas/assets: 
  // Sirve rápido desde el caché y actualiza el caché de fondo en segundo plano.
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});