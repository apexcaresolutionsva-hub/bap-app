// BAP service worker: opens the app shell instantly and shows a friendly page when offline.
// Data (leads, pipeline) always comes live from Supabase; it is never cached here.
const CACHE = "bap-shell-v1";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;   // Supabase, fonts, etc. go straight to the network
  if (req.mode === "navigate") {
    // pages: try the network first (always the newest app), fall back to the saved copy when offline
    e.respondWith(fetch(req).then((res) => {
      const copy = res.clone(); caches.open(CACHE).then((c) => c.put("./index.html", copy)); return res;
    }).catch(() => caches.match("./index.html").then((r) => r || new Response(
      "<h1 style='font-family:system-ui'>You're offline</h1><p style='font-family:system-ui'>BAP needs an internet connection to load your leads. Reconnect and try again.</p>",
      { headers: { "Content-Type": "text/html" } }))));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});
