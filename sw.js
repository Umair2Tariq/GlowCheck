const CACHE_NAME = "glowcheck-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./ingredients.js",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./assets/avatar.svg",
  "./assets/product-cream.svg",
  "./assets/product-serum.svg",
  "./assets/product-toner.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request).then((response) => {
        if (!response.ok || new URL(event.request.url).origin !== self.location.origin) {
          return response;
        }

        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
