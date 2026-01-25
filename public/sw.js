const CACHE_NAME = "seed-mnemonic-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/IB_icon.png",
  "/seedIB_icon.png",
  "/src/main.tsx",
  "/src/App.tsx",
  "/src/components/Navbar.tsx",
  "/src/components/WalletGenerator.tsx",
  "/src/components/ThemeToggle.tsx",
  "/src/components/About.tsx",
  "/src/components/StrengthMeter.tsx",
  "/src/lib/deriveFromPassphrase.ts",
  "/src/lib/utils.ts",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
