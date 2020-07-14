importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

workbox.precaching.precacheAndRoute([
    // root folder
    { url: './index.html', revision: '10' },
    { url: './main.js', revision: '10' },
    { url: './match.html', revision: '10' },
    { url: './match.js', revision: '10' },
    { url: './team.html', revision: '10' },
    { url: './team.js', revision: '10' },
    { url: './manifest.json', revision: '10' },
    { url: './service-worker.js', revision: '10' },
    // asset folder
    { url: './asset/img/icon/city.svg', revision: '10' },
    { url: './asset/img/icon/founded.svg', revision: '10' },
    { url: './asset/img/error.png', revision: '10' },
    { url: './asset/img/icon192.png', revision: '10' },
    { url: './asset/img/icon512.png', revision: '10' },
    { url: './asset/img/match.jpg', revision: '10' },
    { url: './asset/img/standing.jpg', revision: '10' },
    { url: './asset/img/team.jpg', revision: '10' },
    { url: './asset/script/api.js', revision: '10' },
    { url: './asset/script/db.js', revision: '10' },
    { url: './asset/script/idb.js', revision: '10' },
    { url: './asset/script/jquery.js', revision: '10' },
    { url: './asset/script/navigation.js', revision: '10' },
    { url: './asset/script/script.js', revision: '10' },
    { url: './asset/script/display.js', revision: '10' },
    // pages folder
    { url: './pages/nav.html', revision: '10' },
    { url: './pages/home.html', revision: '10' },
    { url: './pages/bookmarks.html', revision: '10' },
    // style folder
    { url: './style/font/EASPORTS15.ttf', revision: '10' },
    { url: './style/js/materialize.min.js', revision: '10' },
    { url: './style/css/materialize.min.css', revision: '10' },
    { url: './style/css/style.css', revision: '10' },
]);

workbox.routing.registerRoute(
    new RegExp('https://upload.wikimedia.org/wikipedia/'),
    workbox.strategies.networkFirst({
        cacheName: "badge",
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
        ],
        networkTimeoutSeconds: 3
    })
)

workbox.routing.registerRoute(
    new RegExp('https://fonts.gstatic.com/s/materialicons/'),
    workbox.strategies.cacheFirst({
        cacheName: 'icon',
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ],
    })
)

workbox.routing.registerRoute(
    new RegExp('/asset/img/'),
    workbox.strategies.cacheOnly()
);

workbox.routing.registerRoute(
    new RegExp('/style/'),
    workbox.strategies.cacheOnly()
);

workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org/v2'),
    workbox.strategies.networkFirst({
        cacheName: 'football',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 10,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
        ],
        networkTimeoutSeconds: 3
    })
);


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