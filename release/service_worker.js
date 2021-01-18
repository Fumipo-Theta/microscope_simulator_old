/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/sw/service_worker.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/sw/service_worker.js":
/*!**********************************!*\
  !*** ./src/sw/service_worker.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const VERSION = \"1.7.1\";\nconst ORIGIN = (location.hostname == 'localhost') ? '' : location.protocol + '//' + location.hostname;\n\n\nconst STATIC_CACHE_KEY = 'static-' + VERSION;\nconst STATIC_FILES = [\n    ORIGIN + '/',\n    ORIGIN + '/index.html',\n    ORIGIN + '/js/app.js',\n    ORIGIN + '/css/main.css',\n    ORIGIN + '/js/zip.js',\n    ORIGIN + '/js/jsinflate.js',\n    ORIGIN + '/images/SCOPin_image.svg',\n    ORIGIN + '/images/ProfilePhoto.jpg',\n    ORIGIN + '/images/facebook-brands.svg',\n    ORIGIN + '/images/twitter-square-brands.svg',\n    ORIGIN + '/images/line-brands.svg',\n    ORIGIN + '/images/SCOPin_favicon.png',\n\n    ORIGIN + \"/js/lib/axios/dist/axios.standalone.js\",\n    ORIGIN + \"/js/lib/CryptoJS/rollups/hmac-sha256.js\",\n    ORIGIN + \"/js/lib/CryptoJS/rollups/sha256.js\",\n    ORIGIN + \"/js/lib/CryptoJS/components/hmac.js\",\n    ORIGIN + \"/js/lib/CryptoJS/components/enc-base64.js\",\n    ORIGIN + \"/js/lib/url-template/url-template.js\",\n    ORIGIN + \"/js/lib/apiGatewayCore/sigV4Client.js\",\n    ORIGIN + \"/js/lib/apiGatewayCore/apiGatewayClient.js\",\n    ORIGIN + \"/js/lib/apiGatewayCore/simpleHttpClient.js\",\n    ORIGIN + \"/js/lib/apiGatewayCore/utils.js\",\n    ORIGIN + \"/js/apigClient.js\",\n    ORIGIN + \"/js/payment.js\",\n    //\"https://js.stripe.com/v3/\",\n    ORIGIN + \"/js/app_social_connection.js\",\n\n];\n\nconst CACHE_KEYS = [\n    STATIC_CACHE_KEY\n];\n\nself.addEventListener(\"message\", (event) => {\n    if (event.data.action === \"skipWaiting\") {\n        console.log(\"Skip waiting\")\n        self.skipWaiting()\n    }\n})\n\n\nself.addEventListener('install', event => {\n    //console.log(\"Skip waiting !\")\n    //event.waitUntil()\n    console.log(\"Store static files\")\n    event.waitUntil(\n        caches.open(STATIC_CACHE_KEY).then(cache => {\n            return Promise.all(\n                STATIC_FILES.map(url => {\n                    return fetch(new Request(url, { cache: 'no-cache', mode: 'no-cors' })).then(response => {\n                        return cache.put(url, response);\n                    });\n                })\n            );\n        })\n    );\n});\n\nself.addEventListener('fetch', event => {\n\n\n    event.respondWith(\n        caches.match(event.request).then(async response => {\n            if (response) {\n                return response\n            } else {\n                try {\n                    var r = await fetch(event.request)\n                } catch (e) {\n                    console.warn(`${event.request} cannot be fetched.`)\n\n                }\n                return r\n            }\n        })\n    );\n});\n\n\nself.addEventListener('activate', event => {\n    console.log(\"Delete previous caches !\")\n    event.waitUntil(\n        caches.keys().then(keys => {\n            return Promise.all(\n                keys.filter(key => {\n                    return !CACHE_KEYS.includes(key);\n                }).map(key => {\n                    return caches.delete(key);\n                })\n            );\n        })\n    );\n});\n\nself.addEventListener('push', event => {\n    const options = event.data.json();\n    event.waitUntil(\n        caches.open(STATIC_CACHE_KEY).then(cache => {\n            fetch(new Request(options.data.url, { mode: 'no-cors' })).then(response => {\n                cache.put(options.data.url, response);\n            }).then(() => {\n                self.registration.showNotification(options.title, options);\n            });\n        })\n    );\n});\n\nself.addEventListener('notificationclick', event => {\n    event.notification.close();\n    event.waitUntil(\n        clients.openWindow(event.notification.data.url)\n    );\n});\n\n\n//# sourceURL=webpack:///./src/sw/service_worker.js?");

/***/ })

/******/ });