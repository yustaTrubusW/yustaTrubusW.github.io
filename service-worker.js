const CACHE_NAME = "the_soccer-v1.9";
const urlsToCache = [
    "./",
    "./asset/script/api.js",
    "./asset/script/db.js",
    "./asset/script/idb.js",
    "./asset/script/jquery.js",
    "./asset/script/navigation.js",
    "./asset/script/script.js",
    "./asset/img/error.png",
    "./asset/img/icon512.png",
    "./asset/img/icon192.png",
    "./asset/img/match.jpg",
    "./asset/img/standing.jpg",
    "./asset/img/team.jpg",
    "./asset/img/icon/founded.svg",
    "./asset/img/icon/city.svg",
    "./pages/bookmarks.html",
    "./pages/home.html",
    "./pages/nav.html",
    "./pages/bookmarks-component/js/team.js",
    "./pages/bookmarks-component/js/match.js",
    "./style/css/materialize.min.css",
    "./style/css/style.css",
    "./style/font/EASPORTS15.ttf",
    "./style/js/materialize.min.js",
    "./index.html",
    "./match.html",
    "./team.html",
    "./manifest.json",
    "./service-worker.js"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", (event) => {
    const base_url = "https://api.football-data.org/";

    if (event.request.url.indexOf(base_url) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function(cache) {
                return fetch(event.request).then(function(response) {
                    cache.put(event.request.url, response.clone());
                    return response;
                })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true }).then(function(response) {
                return response || fetch(event.request);
            })
        )
    }
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName != CACHE_NAME) {
                        console.log("ServiceWorker: cache " + cacheName + " dihapus");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('push', (event) => {
    let body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'push masage not payload';
    }

    const options = {
        body: body,
        icon: './asset/img/icon192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
})