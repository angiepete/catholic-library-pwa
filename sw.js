const CACHE = "catholic-library-v2";
const ASSETS = ["./", "./index.html", "./styles.css", "./app.js", "./manifest.json", "./index.json"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      if (e.request.url.includes("/texts/")) {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return resp;
    }))
  );
});