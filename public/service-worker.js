/* eslint-disable no-restricted-globals */
importScripts("https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js");

const CACHE_VERSION = "v1";
const STATIC_CACHE = `agrilink-static-${CACHE_VERSION}`;
const PAGE_CACHE = `agrilink-pages-${CACHE_VERSION}`;
const API_CACHE = `agrilink-api-${CACHE_VERSION}`;

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

workbox.core.clientsClaim();
workbox.core.skipWaiting();
workbox.core.setCacheNameDetails({
  prefix: "agrilink",
  suffix: CACHE_VERSION,
  precache: "precache",
  runtime: "runtime"
});

workbox.routing.registerRoute(
  ({ request, url }) =>
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "font" ||
    request.destination === "image" ||
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/"),
  new workbox.strategies.CacheFirst({
    cacheName: STATIC_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 120,
        maxAgeSeconds: 30 * 24 * 60 * 60
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

workbox.routing.registerRoute(
  ({ url, request }) => url.pathname.startsWith("/api/") || request.headers.get("accept")?.includes("application/json"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: API_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 80,
        maxAgeSeconds: 24 * 60 * 60
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

workbox.routing.registerRoute(
  ({ request }) => request.mode === "navigate",
  new workbox.strategies.NetworkFirst({
    cacheName: PAGE_CACHE,
    networkTimeoutSeconds: 3,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 40,
        maxAgeSeconds: 7 * 24 * 60 * 60
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);
