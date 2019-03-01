const VERSION = "1.1.9";
const ORIGIN = (location.hostname == 'localhost') ? '' : location.protocol + '//' + location.hostname;

console.log(location.protocol, location.hostname)

const STATIC_CACHE_KEY = 'static-' + VERSION;
const STATIC_FILES = [
    //ORIGIN + '/',
    ORIGIN + '/index_offline.html',
    ORIGIN + '/css/main_offline.css',
    ORIGIN + '/js/app_offline.js',
    ORIGIN + '/js/zip.js',
    ORIGIN + '/js/jsinflate.js',
    "https://cdn.jsdelivr.net/npm/text-encoding@0.6.4/lib/encoding-indexes.js",
    "https://cdn.jsdelivr.net/npm/text-encoding@0.6.4/lib/encoding.js",

    //ORIGIN + '/images/SCOPin_rock_logo.svg',
    ORIGIN + '/images/SCOPin_image.svg',
    ORIGIN + '/images/ProfilePhoto.jpg',
    ORIGIN + '/images/facebook-brands.svg',
    ORIGIN + '/images/twitter-square-brands.svg',
    ORIGIN + '/images/line-brands.svg',
    ORIGIN + '/images/SCOPin_favicon.png',

    'https://connect.facebook.net/ja_JP/sdk.js#xfbml=1&version=v3.2',
    "https://s3-ap-northeast-1.amazonaws.com/fumipo-theta-microscope/images/SCOPin_image.png",

    ORIGIN + "/js/lib/axios/dist/axios.standalone.js",
    ORIGIN + "/js/lib/CryptoJS/rollups/hmac-sha256.js",
    ORIGIN + "/js/lib/CryptoJS/rollups/sha256.js",
    ORIGIN + "/js/lib/CryptoJS/components/hmac.js",
    ORIGIN + "/js/lib/CryptoJS/components/enc-base64.js",
    ORIGIN + "/js/lib/url-template/url-template.js",
    ORIGIN + "/js/lib/apiGatewayCore/sigV4Client.js",
    ORIGIN + "/js/lib/apiGatewayCore/apiGatewayClient.js",
    ORIGIN + "/js/lib/apiGatewayCore/simpleHttpClient.js",
    ORIGIN + "/js/lib/apiGatewayCore/utils.js",
    ORIGIN + "/js/apigClient.js",
    ORIGIN + "/js/payment.js",
    "https://js.stripe.com/v3/",
    ORIGIN + "/js/app_social_connection.js",
    "https://www.googletagmanager.com/gtag/js?id=UA-134075472-1",
];

const CACHE_KEYS = [
    STATIC_CACHE_KEY
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE_KEY).then(cache => {
            return Promise.all(
                STATIC_FILES.map(url => {
                    return fetch(new Request(url, { cache: 'no-cache', mode: 'no-cors' })).then(response => {
                        return cache.put(url, response);
                    });
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {

    if ([location.origin + "/", location.origin + "/index.html"].includes(event.request.url)) {
        event.respondWith(
            caches.match(event.request).then(async response => {
                if (response) {
                    return response
                } else {
                    try {
                        var r = await fetch(event.request)
                    } catch (e) {
                        r = await caches.match(location.origin + "/index_offline.html", {
                            method: "GET"
                        })

                    }
                    return r
                }
            })
        );
    } else {

        event.respondWith(
            caches.match(event.request).then(response => {
                return response || new Promise((res, rej) => {
                    fetch(event.request).then(res).catch(rej)
                })
            })
        );
    }
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => {
                    return !CACHE_KEYS.includes(key);
                }).map(key => {
                    return caches.delete(key);
                })
            );
        })
    );
});

self.addEventListener('push', event => {
    const options = event.data.json();
    event.waitUntil(
        caches.open(STATIC_CACHE_KEY).then(cache => {
            fetch(new Request(options.data.url, { mode: 'no-cors' })).then(response => {
                cache.put(options.data.url, response);
            }).then(() => {
                self.registration.showNotification(options.title, options);
            });
        })
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
