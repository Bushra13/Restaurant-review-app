let cacheName = 'restaurant-cache-v1';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            return cache.addAll([
                './',
                './index.html',
                './restaurant.html',
                './css/styles.css',
                './data/restaurants.json',
                './js/main.js',
                './js/restaurant_info.js',
                './js/dbhelper.js',
                './js/sw_registration.js',
                './img/1.jpg',
                './img/2.jpg',
                './img/3.jpg',
                './img/4.jpg',
                './img/5.jpg',
                './img/6.jpg',
                './img/7.jpg',
                './img/8.jpg',
                './img/9.jpg',
                './img/10.jpg',
                'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
                'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js'
                ])
        })
        .then(self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
        .then(cacheNames => Promise.all(cacheNames.map(cache => {
            if (cache !== cacheName) {
                console.log('Service worker will remove cached files from ', cache);
                return caches.delete(cache);
            }
        })))
    )
});

self.addEventListener('fetch', event => {
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
        );
    };
    

});
