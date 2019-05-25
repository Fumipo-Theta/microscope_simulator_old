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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/DatabaseHandler.js":
/*!********************************!*\
  !*** ./src/DatabaseHandler.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return DatabaseHandler; });\nclass DatabaseHandler {\r\n    constructor(db_name, version, storeName, primaryKeyName) {\r\n        this.db = window.indexedDB;\r\n        this.db_name = db_name;\r\n        this.db_version = version;\r\n        this.storeName = storeName;\r\n        this.primaryKey = primaryKeyName;\r\n    }\r\n\r\n    schemeDef(db) {\r\n        db.createObjectStore(this.storeName, { keyPath: this.primaryKey, autoIncrement: true });\r\n    }\r\n\r\n    connect() {\r\n        const dbp = new Promise((resolve, reject) => {\r\n            const req = this.db.open(this.db_name, this.db_version);\r\n            req.onsuccess = ev => resolve(ev.target.result);\r\n            req.onerror = ev => reject('fails to open db');\r\n            req.onupgradeneeded = ev => this.schemeDef(ev.target.result);\r\n        });\r\n        dbp.then(d => d.onerror = ev => alert(\"error: \" + ev.target.errorCode));\r\n        return dbp;\r\n    }\r\n\r\n    async put(db, obj) { // returns obj in IDB\r\n        return new Promise((resolve, reject) => {\r\n            const docs = db.transaction([this.storeName], 'readwrite').objectStore(this.storeName);\r\n            const req = docs.put(obj);\r\n            req.onsuccess = () => resolve(Object.assign({ [this.primaryKey]: req.result }, obj));\r\n            req.onerror = reject;\r\n        });\r\n    }\r\n\r\n    async get(db, id) { // NOTE: if not found, resolves with undefined.\r\n        return new Promise((resolve, reject) => {\r\n            const docs = db.transaction([this.storeName,]).objectStore(this.storeName);\r\n            const req = docs.get(id);\r\n            req.onsuccess = () => resolve(req.result);\r\n            req.onerror = reject;\r\n        });\r\n    }\r\n\r\n    async delete(db, id) {\r\n        return new Promise((resolve, reject) => {\r\n            const docs = db.transaction([this.storeName,], 'readwrite')\r\n                .objectStore(this.storeName);\r\n            const req = docs.delete(id);\r\n            req.onsuccess = () => resolve(id);\r\n            req.onerror = reject;\r\n        })\r\n    }\r\n\r\n    async loadAllKey(db) {\r\n        return new Promise(async (resolve, reject) => {\r\n            const saves = [];\r\n            var range = IDBKeyRange.lowerBound(0);\r\n            const req = db.transaction([this.storeName]).objectStore(this.storeName).openCursor(range);\r\n            req.onsuccess = function (e) {\r\n                var result = e.target.result;\r\n                // 注）走査すべきObjectがこれ以上無い場合\r\n                //     result == null となります！\r\n                if (!!result == false) {\r\n                    resolve(saves)\r\n                } else {\r\n                    // ここにvalueがくる！\r\n                    saves.push(result.key);\r\n                    // カーソルを一個ずらす\r\n                    result.continue();\r\n                }\r\n\r\n\r\n            }\r\n        });\r\n    }\r\n\r\n    async getAllKeys(db) {\r\n        return new Promise(async (resolve, reject) => {\r\n            try {\r\n                var req = db.transaction([this.storeName]).objectStore(this.storeName)\r\n            } catch (e) {\r\n                return resolve([])\r\n            }\r\n\r\n            if (req.getAllKeys) {\r\n                req.getAllKeys().onsuccess = function (event) {\r\n                    const rows = event.target.result;\r\n                    resolve(rows);\r\n                }\r\n            } else {\r\n                const entries = await this.loadAllKey(db)\r\n                resolve(entries)\r\n            }\r\n            req.onerror = reject\r\n        })\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/DatabaseHandler.js?");

/***/ }),

/***/ "./src/DummyDatabaseHandler.js":
/*!*************************************!*\
  !*** ./src/DummyDatabaseHandler.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return DummyDatabaseHandler; });\n/* harmony import */ var _DatabaseHandler_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DatabaseHandler.js */ \"./src/DatabaseHandler.js\");\n\r\n\r\nclass DummyDatabaseHandler extends _DatabaseHandler_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\r\n    constructor(db_name, version, storeName, primaryKeyName) {\r\n        console.warn(\"IndexedDB is not available !\")\r\n        super(db_name, version, storeName, primaryKeyName)\r\n        this.storage = {}\r\n    }\r\n\r\n    connect() {\r\n        return {}\r\n    }\r\n\r\n    put(db, obj) {\r\n        if (db.hasOwnProperty(obj[this.primaryKey])) {\r\n            var old = db[obj[this.primaryKey]]\r\n        } else {\r\n            var old = {}\r\n        }\r\n        const new_entry = Object.assign(old, obj)\r\n        db[obj[this.primaryKey]] = new_entry;\r\n        return { [obj[this.primaryKey]]: new_entry }\r\n    }\r\n\r\n    get(db, id) {\r\n        if (db.hasOwnProperty(id)) {\r\n            return db[id]\r\n        } else {\r\n            return undefined\r\n        }\r\n    }\r\n\r\n    delete(db, id) {\r\n        if (db.hasOwnProperty(id)) {\r\n            db[id] = null;\r\n            return id\r\n        } else {\r\n            return undefined\r\n        }\r\n    }\r\n\r\n    loadAll(db) {\r\n        return Object.entries(db)\r\n    }\r\n\r\n    getAllKeys(db) {\r\n        return Object.keys(db)\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/DummyDatabaseHandler.js?");

/***/ }),

/***/ "./src/DummyLocalStorage.js":
/*!**********************************!*\
  !*** ./src/DummyLocalStorage.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return DummyLocalStorage; });\nclass DummyLocalStorage {\r\n    constructor() {\r\n        this.db = {}\r\n    }\r\n\r\n    put(key, value) {\r\n        this.db[key] = value;\r\n    }\r\n\r\n    get(key) {\r\n        return (this.db.hasOwnProperty(\"key\"))\r\n            ? this.db[key]\r\n            : undefined\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/DummyLocalStorage.js?");

/***/ }),

/***/ "./src/ISmallStorageFactory.js":
/*!*************************************!*\
  !*** ./src/ISmallStorageFactory.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return ISmallStorageFactory; });\n/* harmony import */ var _NativeLocalStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NativeLocalStorage */ \"./src/NativeLocalStorage.js\");\n/* harmony import */ var _DummyLocalStorage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DummyLocalStorage */ \"./src/DummyLocalStorage.js\");\n\r\n\r\n\r\n\r\nfunction ISmallStorageFactory() {\r\n    return (window.localStorage)\r\n        ? new _NativeLocalStorage__WEBPACK_IMPORTED_MODULE_0__[\"default\"]()\r\n        : new _DummyLocalStorage__WEBPACK_IMPORTED_MODULE_1__[\"default\"]()\r\n}\r\n\n\n//# sourceURL=webpack:///./src/ISmallStorageFactory.js?");

/***/ }),

/***/ "./src/MessageBarActivitySwitcher.js":
/*!*******************************************!*\
  !*** ./src/MessageBarActivitySwitcher.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return MessageBarActivitySwitcher; });\nclass MessageBarActivitySwitcher {\r\n    constructor(messageBarSelector) {\r\n        this.root = document.querySelector(messageBarSelector)\r\n        this.hook = {}\r\n        return this\r\n    }\r\n\r\n    activate() {\r\n        this.hook[\"activate\"](this.root)\r\n        this.root.classList.remove(\"inactive\")\r\n    }\r\n\r\n    inactivate() {\r\n        this.hook[\"inactivate\"](this.root)\r\n        this.root.classList.add(\"inactive\")\r\n    }\r\n\r\n    setHookOnActivate(hook = rootNode => { }) {\r\n        this.hook[\"activate\"] = hook\r\n        return this\r\n    }\r\n\r\n    setHookOnInactivate(hook = rootNode => { }) {\r\n        this.hook[\"inactivate\"] = hook\r\n        return this\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/MessageBarActivitySwitcher.js?");

/***/ }),

/***/ "./src/NativeLocalStorage.js":
/*!***********************************!*\
  !*** ./src/NativeLocalStorage.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return NativeLocalStorage; });\nclass NativeLocalStorage {\r\n    constructor() {\r\n        this.db = window.localStorage\r\n    }\r\n\r\n    put(key, value) {\r\n        this.db.setItem(key, value);\r\n    }\r\n\r\n    get(key) {\r\n        const value = this.db.getItem(key)\r\n        return (value == null)\r\n            ? undefined\r\n            : value\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/NativeLocalStorage.js?");

/***/ }),

/***/ "./src/StaticManager.js":
/*!******************************!*\
  !*** ./src/StaticManager.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return StaticManager; });\nclass StaticManager {\r\n    constructor(\r\n        sampleListURL,\r\n        imageDataPathPrefix,\r\n        dbName,\r\n        storageName\r\n    ) {\r\n        this.sampleListURL = sampleListURL\r\n        this.imageDataRoot = imageDataPathPrefix\r\n        this.indexedDBName = dbName\r\n        this.storageName = storageName\r\n    }\r\n\r\n    getSampleListURL() {\r\n        return this.sampleListURL\r\n    }\r\n\r\n    getImageDataPath(packageName) {\r\n        return this.imageDataRoot + packageName + \"/\"\r\n    }\r\n\r\n    getDBName() {\r\n        return this.indexedDBName;\r\n    }\r\n\r\n    getStorageName() {\r\n        return this.storageName\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/StaticManager.js?");

/***/ }),

/***/ "./src/checkSupportedImageFormat.js":
/*!******************************************!*\
  !*** ./src/checkSupportedImageFormat.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return checkSupportedImageFormat; });\n/* harmony import */ var _detect_supported_image_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./detect_supported_image.js */ \"./src/detect_supported_image.js\");\n/* harmony import */ var _getSupportedImageType_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getSupportedImageType.js */ \"./src/getSupportedImageType.js\");\n\r\n\r\n\r\nasync function checkSupportedImageFormat(state) {\r\n    state.supportWebp = await Object(_detect_supported_image_js__WEBPACK_IMPORTED_MODULE_0__[\"detectWebpSupport\"])();\r\n    state.supportJ2k = await Object(_detect_supported_image_js__WEBPACK_IMPORTED_MODULE_0__[\"detectJ2kSupport\"])();\r\n    state.supportedImageType = await Object(_getSupportedImageType_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\r\n    return state\r\n}\r\n\n\n//# sourceURL=webpack:///./src/checkSupportedImageFormat.js?");

/***/ }),

/***/ "./src/clipGeometryFromImageCenter.js":
/*!********************************************!*\
  !*** ./src/clipGeometryFromImageCenter.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return clipGeometoryFromImageCenter; });\nfunction clipGeometoryFromImageCenter(state) {\r\n\r\n    return [\r\n        state.rotate_center.to_right - state.imageRadius,\r\n        state.rotate_center.to_bottom - state.imageRadius,\r\n        state.imageRadius * 2,\r\n        state.imageRadius * 2\r\n    ]\r\n}\r\n\n\n//# sourceURL=webpack:///./src/clipGeometryFromImageCenter.js?");

/***/ }),

/***/ "./src/connectDatabase.js":
/*!********************************!*\
  !*** ./src/connectDatabase.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return connectDatabase; });\n/* harmony import */ var _global_objects_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global_objects.js */ \"./src/global_objects.js\");\n/* harmony import */ var _DatabaseHandler_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DatabaseHandler.js */ \"./src/DatabaseHandler.js\");\n/* harmony import */ var _DummyDatabaseHandler_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DummyDatabaseHandler.js */ \"./src/DummyDatabaseHandler.js\");\n\r\n\r\n\r\n\r\nasync function connectDatabase(state) {\r\n    state.zipDBHandler = (window.indexedDB)\r\n        ? (!navigator.userAgent.match(\"Edge\"))\r\n            ? new _DatabaseHandler_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"](_global_objects_js__WEBPACK_IMPORTED_MODULE_0__[\"staticSettings\"].getDBName(), 2, _global_objects_js__WEBPACK_IMPORTED_MODULE_0__[\"staticSettings\"].getStorageName(), \"id\")\r\n            : new _DatabaseHandler_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"](_global_objects_js__WEBPACK_IMPORTED_MODULE_0__[\"staticSettings\"].getDBName(), 1, _global_objects_js__WEBPACK_IMPORTED_MODULE_0__[\"staticSettings\"].getStorageName(), \"id\")\r\n        : new _DummyDatabaseHandler_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"](_global_objects_js__WEBPACK_IMPORTED_MODULE_0__[\"staticSettings\"].getDBName(), 2, _global_objects_js__WEBPACK_IMPORTED_MODULE_0__[\"staticSettings\"].getStorageName(), \"id\")\r\n    state.zipDB = await state.zipDBHandler.connect()\r\n    state.storedKeys = await state.zipDBHandler.getAllKeys(state.zipDB)\r\n    return state\r\n};\r\n\n\n//# sourceURL=webpack:///./src/connectDatabase.js?");

/***/ }),

/***/ "./src/connectLocalStorage.js":
/*!************************************!*\
  !*** ./src/connectLocalStorage.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return connectLocalStorage; });\n/* harmony import */ var _ISmallStorageFactory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ISmallStorageFactory.js */ \"./src/ISmallStorageFactory.js\");\n\r\n\r\nfunction connectLocalStorage(state) {\r\n    state.localStorage = Object(_ISmallStorageFactory_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\r\n    return state\r\n}\r\n\n\n//# sourceURL=webpack:///./src/connectLocalStorage.js?");

/***/ }),

/***/ "./src/coordinate_updators.js":
/*!************************************!*\
  !*** ./src/coordinate_updators.js ***!
  \************************************/
/*! exports provided: canvasCoordinate, updateCoordinate, updateRotate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"canvasCoordinate\", function() { return canvasCoordinate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"updateCoordinate\", function() { return updateCoordinate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"updateRotate\", function() { return updateRotate; });\n/* harmony import */ var _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./viewer_canvas.js */ \"./src/viewer_canvas.js\");\n/* harmony import */ var _getCoordinateOnCanvas_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getCoordinateOnCanvas.js */ \"./src/getCoordinateOnCanvas.js\");\n/* harmony import */ var _radiunBetween_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./radiunBetween.js */ \"./src/radiunBetween.js\");\n\r\n\r\n\r\n\r\n\r\nconst canvasCoordinate = Object(_getCoordinateOnCanvas_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(_viewer_canvas_js__WEBPACK_IMPORTED_MODULE_0__[\"viewer\"])\r\n\r\n/**\r\n * Update start and end position\r\n * @param {*} state\r\n * @param {*} e\r\n */\r\nfunction updateCoordinate(state, e) {\r\n    state.drag_start = state.drag_end || undefined\r\n    state.drag_end = canvasCoordinate(e)\r\n\r\n    state.pinch_start = state.pinch_end || undefined\r\n    state.pinch_end = canvasCoordinate(e, 1)\r\n    return state\r\n}\r\n\r\n/**\r\n * Calculate small difference of rotation.\r\n * Update total rotation.\r\n *\r\n * @param {*} state\r\n * @param {*} e\r\n */\r\nfunction updateRotate(state, e) {\r\n    if (!state.canRotate) return;\r\n    if (state.drag_start === undefined) return\r\n    // delta rotate radius\r\n    const rotate_end = Object(_radiunBetween_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\r\n        state.canvasWidth * 0.5,\r\n        state.canvasHeight * 0.5\r\n    )(...state.drag_end, ...state.drag_start)\r\n\r\n    state.rotate += rotate_end / Math.PI * 180\r\n    if (state.rotate >= 360) {\r\n        state.rotate -= 360\r\n    } else if (state.rotate < 0) {\r\n        state.rotate += 360\r\n    }\r\n    return state\r\n}\r\n\n\n//# sourceURL=webpack:///./src/coordinate_updators.js?");

/***/ }),

/***/ "./src/data_translaters.js":
/*!*********************************!*\
  !*** ./src/data_translaters.js ***!
  \*********************************/
/*! exports provided: bufferToBase64, blobToBase64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"bufferToBase64\", function() { return bufferToBase64; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"blobToBase64\", function() { return blobToBase64; });\nif (!HTMLCanvasElement.prototype.toBlob) {\r\n    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {\r\n        value: function (callback, type, quality) {\r\n\r\n            var binStr = atob(this.toDataURL(type, quality).split(',')[1]),\r\n                len = binStr.length,\r\n                arr = new Uint8Array(len);\r\n\r\n            for (var i = 0; i < len; i++) {\r\n                arr[i] = binStr.charCodeAt(i);\r\n            }\r\n\r\n            callback(new Blob([arr], { type: type || 'image/png' }));\r\n        }\r\n    });\r\n}\r\n\r\nfunction bufferToBase64(buffer, ext) {\r\n    return new Promise((res, rej) => {\r\n\r\n        var bytes = new Uint8Array(buffer);\r\n        var binary = '';\r\n        var len = bytes.byteLength;\r\n        for (var i = 0; i < len; i++) {\r\n            binary += String.fromCharCode(bytes[i]);\r\n        }\r\n        res(`data:image/${ext};base64,` + window.btoa(binary));\r\n    })\r\n}\r\n\r\n\r\nfunction blobToBase64(blob) {\r\n    return new Promise((resolve, reject) => {\r\n        const reader = new FileReader;\r\n        reader.onerror = reject;\r\n        reader.onload = () => {\r\n            resolve(reader.result);\r\n        };\r\n        reader.readAsDataURL(blob);\r\n    });\r\n}\r\n\n\n//# sourceURL=webpack:///./src/data_translaters.js?");

/***/ }),

/***/ "./src/deleteOldVersionDatabase.js":
/*!*****************************************!*\
  !*** ./src/deleteOldVersionDatabase.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return deleteOldVersionDatabase; });\n\r\nfunction deleteOldVersionDatabase() {\r\n    indexedDB.deleteDatabase(\"db_v2\");\r\n    indexedDB.deleteDatabase(\"zipfiles\");\r\n}\r\n\n\n//# sourceURL=webpack:///./src/deleteOldVersionDatabase.js?");

/***/ }),

/***/ "./src/detect_supported_image.js":
/*!***************************************!*\
  !*** ./src/detect_supported_image.js ***!
  \***************************************/
/*! exports provided: detectWebpSupport, detectJ2kSupport */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"detectWebpSupport\", function() { return detectWebpSupport; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"detectJ2kSupport\", function() { return detectJ2kSupport; });\nasync function detectWebpSupport() {\r\n\r\n    const testImageSources = [\r\n        \"data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==\",\r\n        \"data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA=\"\r\n    ]\r\n\r\n    const testImage = (src) => {\r\n        return new Promise((resolve, reject) => {\r\n            var img = document.createElement(\"img\")\r\n            img.onerror = error => resolve(false)\r\n            img.onload = () => resolve(true)\r\n            img.src = src\r\n        })\r\n    }\r\n\r\n    const results = await Promise.all(testImageSources.map(testImage))\r\n\r\n    return results.every(result => !!result)\r\n}\r\n\r\nasync function detectJ2kSupport() {\r\n    const testImageSources = [\r\n        'data:image/jp2;base64,AAAADGpQICANCocKAAAAFGZ0eXBqcDIgAAAAAGpwMiAAAAAtanAyaAAAABZpaGRyAAAABAAAAAQAAw8HAAAAAAAPY29scgEAAAAAABAAAABpanAyY/9P/1EALwAAAAAABAAAAAQAAAAAAAAAAAAAAAQAAAAEAAAAAAAAAAAAAw8BAQ8BAQ8BAf9SAAwAAAABAQAEBAAB/1wABECA/5AACgAAAAAAGAAB/5PP/BAQFABcr4CA/9k='\r\n    ]\r\n\r\n    const testImage = (src) => {\r\n        return new Promise((resolve, reject) => {\r\n            var img = document.createElement(\"img\")\r\n            img.onerror = error => resolve(false)\r\n            img.onload = () => resolve(true)\r\n            img.src = src\r\n        })\r\n    }\r\n\r\n    const results = await Promise.all(testImageSources.map(testImage))\r\n\r\n    return results.every(result => !!result)\r\n}\r\n\n\n//# sourceURL=webpack:///./src/detect_supported_image.js?");

/***/ }),

/***/ "./src/draw_state_updators.js":
/*!************************************!*\
  !*** ./src/draw_state_updators.js ***!
  \************************************/
/*! exports provided: clearView, blobToCanvas, drawHairLine, drawScale */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"clearView\", function() { return clearView; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"blobToCanvas\", function() { return blobToCanvas; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"drawHairLine\", function() { return drawHairLine; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"drawScale\", function() { return drawScale; });\n/* harmony import */ var _clipGeometryFromImageCenter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./clipGeometryFromImageCenter.js */ \"./src/clipGeometryFromImageCenter.js\");\n/* harmony import */ var _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./viewer_canvas.js */ \"./src/viewer_canvas.js\");\n/* harmony import */ var _global_objects_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./global_objects.js */ \"./src/global_objects.js\");\n/* harmony import */ var _rotation_degree_handlers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./rotation_degree_handlers.js */ \"./src/rotation_degree_handlers.js\");\n\r\n\r\n\r\n\r\n\r\nfunction clearView(state) {\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].clearRect(-state.canvasWidth * 0.5, -state.canvasHeight * 0.5, state.canvasWidth, state.canvasHeight)\r\n    return state\r\n}\r\n\r\nfunction blobToCanvas(state) {\r\n\r\n    const image_srcs = state.isCrossNicol\r\n        ? state.cross_images\r\n        : state.open_images\r\n\r\n    // view window circle\r\n\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].save()\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].beginPath()\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].arc(0, 0, state.canvasWidth / 2 - _global_objects_js__WEBPACK_IMPORTED_MODULE_2__[\"VIEW_PADDING\"], 0, Math.PI * 2, false)\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].clip()\r\n\r\n    // Draw a image\r\n    const alpha = state.getAlpha(state.rotate)\r\n\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].rotate(\r\n        Object(_rotation_degree_handlers_js__WEBPACK_IMPORTED_MODULE_3__[\"rotateSign\"])(state.isClockwise) * (state.rotate + state.getImageNumber(state.rotate) * 15) / 180 * Math.PI\r\n    )\r\n\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].globalAlpha = 1\r\n    const image1 = image_srcs[state.getImageNumber(state.rotate)]\r\n\r\n    try {\r\n        _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].drawImage(\r\n            image1,\r\n            ...Object(_clipGeometryFromImageCenter_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(state),\r\n            -state.canvasWidth / 2,\r\n            -state.canvasHeight / 2,\r\n            state.canvasWidth,\r\n            state.canvasHeight\r\n        );\r\n    } catch (e) {\r\n\r\n    }\r\n\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].restore()\r\n\r\n    // Draw next image\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].save()\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].beginPath()\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].arc(0, 0, state.canvasWidth / 2 - _global_objects_js__WEBPACK_IMPORTED_MODULE_2__[\"VIEW_PADDING\"], 0, Math.PI * 2, false)\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].clip()\r\n\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].rotate(\r\n        Object(_rotation_degree_handlers_js__WEBPACK_IMPORTED_MODULE_3__[\"rotateSign\"])(state.isClockwise) * (state.rotate + state.getImageNumber(state.rotate + 15) * 15) / 180 * Math.PI\r\n    )\r\n\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].globalAlpha = 1 - alpha\r\n    const image2 = image_srcs[state.getImageNumber(state.rotate + 15)]\r\n    try {\r\n        _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].drawImage(\r\n            image2,\r\n            ...Object(_clipGeometryFromImageCenter_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(state),\r\n            -state.canvasWidth / 2,\r\n            -state.canvasHeight / 2,\r\n            state.canvasWidth,\r\n            state.canvasHeight)\r\n    } catch (e) {\r\n\r\n    }\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].restore()\r\n    return state\r\n}\r\n\r\nfunction drawHairLine(state) {\r\n    if (!state.drawHairLine) return\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].strokeStyle = state.isCrossNicol\r\n        ? \"white\"\r\n        : \"black\";\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].globalAlpha = 1\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].beginPath()\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].moveTo(0, -state.canvasHeight * 0.5 + _global_objects_js__WEBPACK_IMPORTED_MODULE_2__[\"VIEW_PADDING\"])\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].lineTo(0, state.canvasHeight * 0.5 - _global_objects_js__WEBPACK_IMPORTED_MODULE_2__[\"VIEW_PADDING\"])\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].moveTo(-state.canvasWidth * 0.5 + _global_objects_js__WEBPACK_IMPORTED_MODULE_2__[\"VIEW_PADDING\"], 0)\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].lineTo(state.canvasWidth * 0.5 - _global_objects_js__WEBPACK_IMPORTED_MODULE_2__[\"VIEW_PADDING\"], 0)\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].closePath()\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_1__[\"viewer_ctx\"].stroke()\r\n    return state\r\n}\r\n\r\nconst scaleLength = (canvasWidth, imageWidth, scaleWidth) => canvasWidth * scaleWidth / imageWidth\r\n\r\nfunction drawScale(state) {\r\n    if (!state[\"scaleWidth\"]) return;\r\n    let scalePixel = scaleLength(state.canvasWidth, state.imageRadius * 2, state.scaleWidth)\r\n    const canvasWidth = state.canvasWidth;\r\n    const scaleBar = document.querySelector(\"#scalebar\")\r\n\r\n\r\n    let scaleNumber = state.scaleText.match(/(\\d+\\.?\\d*)/)[0] * 1\r\n    const scaleUnit = state.scaleText.match(/\\D*$/)[0]\r\n\r\n    while (scalePixel >= canvasWidth) {\r\n        scalePixel *= 0.5\r\n        scaleNumber *= 0.5\r\n    }\r\n    scaleBar.style.width = scalePixel + \"px\";\r\n    scaleBar.querySelector(\"div:first-child\").innerHTML = `${scaleNumber} ${scaleUnit}`;\r\n    return state\r\n}\r\n\n\n//# sourceURL=webpack:///./src/draw_state_updators.js?");

/***/ }),

/***/ "./src/error_indicator_handler.js":
/*!****************************************!*\
  !*** ./src/error_indicator_handler.js ***!
  \****************************************/
/*! exports provided: hideErrorMessage, showErrorMessage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"hideErrorMessage\", function() { return hideErrorMessage; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"showErrorMessage\", function() { return showErrorMessage; });\n/* harmony import */ var _MessageBarActivitySwitcher_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MessageBarActivitySwitcher.js */ \"./src/MessageBarActivitySwitcher.js\");\n\r\n\r\nconst switchErrorMessage = new _MessageBarActivitySwitcher_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\r\n    \"#error_message_bar\"\r\n).setHookOnInactivate(\r\n    rootNode => {\r\n        rootNode.classList.remove(\"message-error\")\r\n    }\r\n)\r\n\r\nfunction hideErrorMessage(state) {\r\n    switchErrorMessage.inactivate()\r\n    return state\r\n}\r\n\r\nfunction showErrorMessage(message) {\r\n    return (_) => {\r\n        switchErrorMessage.setHookOnActivate(\r\n            rootDOM => {\r\n                rootDOM.querySelector(\".message_space\").innerHTML = message\r\n                rootDOM.classList.add(\"message-error\")\r\n            }\r\n        )\r\n        switchErrorMessage.activate()\r\n        return _\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/error_indicator_handler.js?");

/***/ }),

/***/ "./src/es6Available.js":
/*!*****************************!*\
  !*** ./src/es6Available.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return es6Available; });\nfunction es6Available() {\r\n    return (typeof Symbol === \"function\" && typeof Symbol() === \"symbol\")\r\n}\r\n\n\n//# sourceURL=webpack:///./src/es6Available.js?");

/***/ }),

/***/ "./src/extractFile.js":
/*!****************************!*\
  !*** ./src/extractFile.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return extractFile; });\n/* harmony import */ var _data_translaters_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data_translaters.js */ \"./src/data_translaters.js\");\n\r\n\r\n/**\r\n *\r\n * @param {*} zip\r\n * @return {Object[meta,zip]}\r\n */\r\nasync function extractFile(zipByte) {\r\n    const zip = Zip.inflate(zipByte)\r\n    const inflated_zip = {}\r\n    await Promise.all(Object.entries(zip.files).map(async kv => {\r\n        if (kv[0].includes(\".json\")) {\r\n            inflated_zip[kv[0]] = kv[1].inflate()\r\n        } else {\r\n            const type = kv[0].match(/.*\\.(\\w+)$/)[1]\r\n            const base64 = await Object(_data_translaters_js__WEBPACK_IMPORTED_MODULE_0__[\"bufferToBase64\"])(kv[1].inflate(), type)\r\n            const mime = base64.match(/^data:(image\\/\\w+);/)[1]\r\n            const mime_type = mime.split(\"/\")[1]\r\n\r\n            const new_file_name = kv[0].split(\".\")[0] + \".\" + mime_type\r\n\r\n            inflated_zip[new_file_name] = base64\r\n\r\n        }\r\n\r\n        return true\r\n    }))\r\n\r\n    return inflated_zip\r\n}\r\n\n\n//# sourceURL=webpack:///./src/extractFile.js?");

/***/ }),

/***/ "./src/fetchImagePackage.js":
/*!**********************************!*\
  !*** ./src/fetchImagePackage.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return fetchImagePackage; });\nfunction fetchImagePackage(fetcher, response, toBeFetch) {\r\n    return async state => {\r\n        if (!toBeFetch) return [state, response];\r\n\r\n        const new_response = Object.assign(\r\n            response,\r\n            { zip: await fetcher() }\r\n        )\r\n        return [state, new_response]\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/fetchImagePackage.js?");

/***/ }),

/***/ "./src/getCoordinateOnCanvas.js":
/*!**************************************!*\
  !*** ./src/getCoordinateOnCanvas.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return getCoordinateOnCanvas; });\nfunction getCoordinateOnCanvas(canvas) {\r\n    return (e, fingur = 0) => {\r\n        if (e instanceof MouseEvent) {\r\n            return (e instanceof WheelEvent)\r\n                ? [\r\n                    e.deltaX,\r\n                    e.deltaY\r\n                ]\r\n                : [\r\n                    e.pageX - canvas.offsetLeft,\r\n                    e.pageY - canvas.offsetTop\r\n                ]\r\n        } else if (e instanceof TouchEvent && e.touches.length > fingur) {\r\n            return [\r\n                e.touches[fingur].pageX - canvas.offsetLeft,\r\n                e.touches[fingur].pageY - canvas.offsetTop\r\n            ]\r\n        }\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/getCoordinateOnCanvas.js?");

/***/ }),

/***/ "./src/getMinimumWindowSize.js":
/*!*************************************!*\
  !*** ./src/getMinimumWindowSize.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return getMinimumWindowSize; });\nfunction getMinimumWindowSize() {\r\n    const width = window.innerWidth\r\n    const height = window.innerHeight - 200\r\n    return width < height ? width : height\r\n}\r\n\n\n//# sourceURL=webpack:///./src/getMinimumWindowSize.js?");

/***/ }),

/***/ "./src/getPackageMetaData.js":
/*!***********************************!*\
  !*** ./src/getPackageMetaData.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return getPackageMetaData; });\n/* harmony import */ var _global_objects_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global_objects.js */ \"./src/global_objects.js\");\n/* harmony import */ var _queryLastModified_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./queryLastModified.js */ \"./src/queryLastModified.js\");\n/* harmony import */ var _queryImagePackage_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./queryImagePackage.js */ \"./src/queryImagePackage.js\");\n\r\n\r\n\r\n\r\n/**\r\n * パッケージのメタデータを取得する.\r\n * @param {*} state\r\n * @param {String} packageName\r\n */\r\nfunction getPackageMetaData(state, packageName) {\r\n    return new Promise(async (res, rej) => {\r\n\r\n\r\n        const imageType = state.supportedImageType\r\n\r\n        const packageUrl = _global_objects_js__WEBPACK_IMPORTED_MODULE_0__[\"staticSettings\"].getImageDataPath(packageName) + imageType + \".zip\"\r\n        const [lastModified, networkDisconnected] = await Object(_queryLastModified_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(packageUrl)\r\n\r\n        const packageMetaData = await Object(_queryImagePackage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(state, packageName, lastModified, networkDisconnected)\r\n\r\n        res(packageMetaData)\r\n    })\r\n}\r\n\n\n//# sourceURL=webpack:///./src/getPackageMetaData.js?");

/***/ }),

/***/ "./src/getSupportedImageType.js":
/*!**************************************!*\
  !*** ./src/getSupportedImageType.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return getSupportedImageType; });\n/* harmony import */ var _detect_supported_image_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./detect_supported_image.js */ \"./src/detect_supported_image.js\");\n\r\n\r\nasync function getSupportedImageType() {\r\n    if (await Object(_detect_supported_image_js__WEBPACK_IMPORTED_MODULE_0__[\"detectWebpSupport\"])()) {\r\n        return \"webp\"\r\n    }\r\n    if (await Object(_detect_supported_image_js__WEBPACK_IMPORTED_MODULE_0__[\"detectJ2kSupport\"])()) {\r\n        return \"jp2\"\r\n    }\r\n    return \"jpg\"\r\n}\r\n\n\n//# sourceURL=webpack:///./src/getSupportedImageType.js?");

/***/ }),

/***/ "./src/global_objects.js":
/*!*******************************!*\
  !*** ./src/global_objects.js ***!
  \*******************************/
/*! exports provided: staticSettings, VIEW_PADDING */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticSettings\", function() { return staticSettings; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"VIEW_PADDING\", function() { return VIEW_PADDING; });\n/* harmony import */ var _StaticManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StaticManager.js */ \"./src/StaticManager.js\");\n\r\n\r\n\r\nconst staticSettings = new _StaticManager_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\r\n    \"./dynamic/rock_list.json\",\r\n    \"./data-packages/\",\r\n    \"db_v3\",\r\n    \"files\"\r\n)\r\n\r\n\r\nconst VIEW_PADDING = 0 // px\r\n\n\n//# sourceURL=webpack:///./src/global_objects.js?");

/***/ }),

/***/ "./src/imagePackageFetcher.js":
/*!************************************!*\
  !*** ./src/imagePackageFetcher.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return imagePackageFetcher; });\n/* harmony import */ var _unzipper_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./unzipper.js */ \"./src/unzipper.js\");\n/* harmony import */ var _extractFile_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extractFile.js */ \"./src/extractFile.js\");\n\r\n\r\n\r\nfunction imagePackageFetcher(packageUrl) {\r\n    return async () => await Object(_unzipper_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(packageUrl)\r\n        .then(_extractFile_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])\r\n}\r\n\n\n//# sourceURL=webpack:///./src/imagePackageFetcher.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _deleteOldVersionDatabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./deleteOldVersionDatabase.js */ \"./src/deleteOldVersionDatabase.js\");\n/* harmony import */ var _init_sw_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./init_sw.js */ \"./src/init_sw.js\");\n/* harmony import */ var _setToggleNicolEvents_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./setToggleNicolEvents.js */ \"./src/setToggleNicolEvents.js\");\n/* harmony import */ var _setRockSelectEventHandlers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./setRockSelectEventHandlers.js */ \"./src/setRockSelectEventHandlers.js\");\n/* harmony import */ var _setCanvasEventHandlers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./setCanvasEventHandlers.js */ \"./src/setCanvasEventHandlers.js\");\n/* harmony import */ var _setLanguageSelectEventHandlers_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./setLanguageSelectEventHandlers.js */ \"./src/setLanguageSelectEventHandlers.js\");\n/* harmony import */ var _setContactFormEventHandlers_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./setContactFormEventHandlers.js */ \"./src/setContactFormEventHandlers.js\");\n/* harmony import */ var _initState_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./initState.js */ \"./src/initState.js\");\n/* harmony import */ var _windowResizeHandler_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./windowResizeHandler.js */ \"./src/windowResizeHandler.js\");\n/* harmony import */ var _updateView_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./updateView.js */ \"./src/updateView.js\");\n/* harmony import */ var _es6Available_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./es6Available.js */ \"./src/es6Available.js\");\n/* harmony import */ var _connectLocalStorage_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./connectLocalStorage.js */ \"./src/connectLocalStorage.js\");\n/* harmony import */ var _checkSupportedImageFormat_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./checkSupportedImageFormat.js */ \"./src/checkSupportedImageFormat.js\");\n/* harmony import */ var _overrideLanguageByLocalStorage_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./overrideLanguageByLocalStorage.js */ \"./src/overrideLanguageByLocalStorage.js\");\n/* harmony import */ var _connectDatabase_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./connectDatabase.js */ \"./src/connectDatabase.js\");\n/* harmony import */ var _sampleListLoader_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./sampleListLoader.js */ \"./src/sampleListLoader.js\");\n/* harmony import */ var _loading_indicator_handler_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./loading_indicator_handler.js */ \"./src/loading_indicator_handler.js\");\n/**\r\n *  Language code of sample list is such as \"ja\" or \"en\".\r\n */\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nObject(_deleteOldVersionDatabase_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])()\r\n\r\n\r\n\r\n\r\nfunction handleErrors(response) {\r\n    if (response.ok) {\r\n        return response;\r\n    }\r\n\r\n    switch (response.status) {\r\n        case 400: throw new Error('INVALID_TOKEN');\r\n        case 401: throw new Error('UNAUTHORIZED');\r\n        case 500: throw new Error('INTERNAL_SERVER_ERROR');\r\n        case 502: throw new Error('BAD_GATEWAY');\r\n        case 404: throw new Error('NOT_FOUND');\r\n        default: throw new Error('UNHANDLED_ERROR');\r\n    }\r\n}\r\n\r\n/**\r\n     *\r\n     * Entry point function !\r\n     */\r\nfunction init(state) {\r\n    const userAgent = navigator.userAgent;\r\n\r\n    // スマートフォンの場合はorientationchangeイベントを監視する\r\n    if (userAgent.indexOf(\"iPhone\") >= 0 || userAgent.indexOf(\"iPad\") >= 0 || userAgent.indexOf(\"Android\") >= 0)\r\n        window.addEventListener(\r\n            \"orientationchange\",\r\n            e => Object(_windowResizeHandler_js__WEBPACK_IMPORTED_MODULE_8__[\"default\"])(state).then(_updateView_js__WEBPACK_IMPORTED_MODULE_9__[\"default\"]),\r\n            false\r\n        );\r\n    else\r\n        window.addEventListener(\r\n            \"resize\",\r\n            e => Object(_windowResizeHandler_js__WEBPACK_IMPORTED_MODULE_8__[\"default\"])(state).then(_updateView_js__WEBPACK_IMPORTED_MODULE_9__[\"default\"]),\r\n            false\r\n        );\r\n\r\n    if (!Object(_es6Available_js__WEBPACK_IMPORTED_MODULE_10__[\"default\"])()) {\r\n        var warnningCard = document.getElementById(\"please_use_modern_browser\")\r\n        warnningCard.classList.remove(\"inactive\")\r\n\r\n    } else {\r\n        Object(_windowResizeHandler_js__WEBPACK_IMPORTED_MODULE_8__[\"default\"])(state)\r\n            .then(_connectLocalStorage_js__WEBPACK_IMPORTED_MODULE_11__[\"default\"])\r\n            .then(_checkSupportedImageFormat_js__WEBPACK_IMPORTED_MODULE_12__[\"default\"])\r\n            .then(_overrideLanguageByLocalStorage_js__WEBPACK_IMPORTED_MODULE_13__[\"default\"])\r\n            .then(_connectDatabase_js__WEBPACK_IMPORTED_MODULE_14__[\"default\"])\r\n            .then(_sampleListLoader_js__WEBPACK_IMPORTED_MODULE_15__[\"default\"])\r\n            .then(_loading_indicator_handler_js__WEBPACK_IMPORTED_MODULE_16__[\"hideLoadingMessage\"])\r\n            .catch(e => {\r\n                console.error(e)\r\n                Object(_loading_indicator_handler_js__WEBPACK_IMPORTED_MODULE_16__[\"hideLoadingMessage\"])(e);\r\n            })\r\n    }\r\n\r\n    Object(_setToggleNicolEvents_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(state)\r\n    Object(_setRockSelectEventHandlers_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(state)\r\n    Object(_setCanvasEventHandlers_js__WEBPACK_IMPORTED_MODULE_4__[\"default\"])(state)\r\n    Object(_setLanguageSelectEventHandlers_js__WEBPACK_IMPORTED_MODULE_5__[\"default\"])(state)\r\n    Object(_setContactFormEventHandlers_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"])(state)\r\n}\r\n\r\nwindow.addEventListener(\r\n    \"DOMcontentloaded\",\r\n    init(Object(_initState_js__WEBPACK_IMPORTED_MODULE_7__[\"default\"])()),\r\n    false\r\n)\r\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/initState.js":
/*!**************************!*\
  !*** ./src/initState.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return initState; });\n/* harmony import */ var _getMinimumWindowSize_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getMinimumWindowSize.js */ \"./src/getMinimumWindowSize.js\");\n/* harmony import */ var _selectLanguageCode_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./selectLanguageCode.js */ \"./src/selectLanguageCode.js\");\n\r\n\r\n\r\nfunction initState() {\r\n    return {\r\n        \"containorID\": \"\",\r\n        \"imageNumber\": 1,\r\n        \"canvasWidth\": Object(_getMinimumWindowSize_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])() <= 500\r\n            ? Object(_getMinimumWindowSize_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])()\r\n            : 500,\r\n        \"canvasHeight\": Object(_getMinimumWindowSize_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])() <= 500\r\n            ? Object(_getMinimumWindowSize_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])()\r\n            : 500,\r\n        \"imageRadius\": 0,\r\n        \"open_image_srcs\": [],\r\n        \"open_images\": [],\r\n        \"cross_image_srcs\": [],\r\n        \"cross_images\": [],\r\n        \"isMousedown\": false,\r\n        \"drag_start\": [0, 0],\r\n        \"drag_end\": [0, 0],\r\n        \"rotate\": 0,\r\n        \"rotate_axis_translate\": [],\r\n        \"isClockwise\": true,\r\n        \"isCrossNicol\": false,\r\n        \"language\": Object(_selectLanguageCode_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(),\r\n        \"storedKeys\": [],\r\n        \"drawHairLine\": true,\r\n        \"canRotate\": true,\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/initState.js?");

/***/ }),

/***/ "./src/init_sw.js":
/*!************************!*\
  !*** ./src/init_sw.js ***!
  \************************/
/*! exports provided: postSkipWaiting, register_sw */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"postSkipWaiting\", function() { return postSkipWaiting; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"register_sw\", function() { return register_sw; });\nlet newWorker\r\n\r\nfunction postSkipWaiting() {\r\n    if (newWorker) {\r\n        newWorker.postMessage({ \"action\": \"skipWaiting\" })\r\n    }\r\n}\r\n\r\n\r\n\r\n\r\nfunction register_sw() {\r\n\r\n    if (!navigator.serviceWorker) return\r\n    navigator.serviceWorker.addEventListener(\r\n        \"controllerchange\",\r\n        () => {\r\n            window.location.reload()\r\n        }\r\n    )\r\n\r\n    navigator.serviceWorker.register(\r\n        './service_worker.js',\r\n        { scope: '.', updateViaCache: \"none\" }\r\n    )\r\n        .then((registraion) => {\r\n            registraion.addEventListener(\"updatefound\", () => {\r\n                console.log(\"update found\")\r\n                newWorker = registraion.installing\r\n                newWorker.addEventListener(\r\n                    \"statechange\", () => {\r\n                        console.log(newWorker.state)\r\n                        switch (newWorker.state) {\r\n                            case \"installed\":\r\n                                console.log(\"new worker installed \")\r\n                                if (navigator.serviceWorker.controller) {\r\n                                    let notification = document.querySelector(\"#update_notification\")\r\n                                    notification.classList.remove(\"inactive\")\r\n                                }\r\n                                break;\r\n                            default:\r\n                                break;\r\n                        }\r\n                    }\r\n                )\r\n            })\r\n\r\n            //return registraion.update();\r\n        })\r\n        .then(function (registration) {\r\n            console.log(\"serviceWorker registed.\");\r\n        })\r\n        .catch(function (error) {\r\n            console.warn(\"serviceWorker error.\", error);\r\n        });\r\n\r\n};\r\n\n\n//# sourceURL=webpack:///./src/init_sw.js?");

/***/ }),

/***/ "./src/languageChangeHandler.js":
/*!**************************************!*\
  !*** ./src/languageChangeHandler.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return languageChangeHandler; });\nfunction languageChangeHandler(state) {\r\n    return function (e) {\r\n        return new Promise((res, rej) => {\r\n            const languageSelector = document.querySelector(\"#language_selector\")\r\n            const lang = languageSelector.options[languageSelector.selectedIndex].value;\r\n            state.language = lang\r\n            state.localStorage.put(\"language\", lang)\r\n            res(state)\r\n        })\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/languageChangeHandler.js?");

/***/ }),

/***/ "./src/loadImageSrc.js":
/*!*****************************!*\
  !*** ./src/loadImageSrc.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return loadImageSrc; });\nfunction handleImgSrc(src) {\r\n    if (src instanceof Blob) {\r\n        const url = window.URL || window.webkitURL;\r\n        return url.createObjectURL(src)\r\n    } else if (src instanceof String) {\r\n        return src\r\n    } else {\r\n        return src\r\n    }\r\n}\r\n\r\n/**\r\n * @parameter src {dataURL}\r\n */\r\nfunction loadImageSrc(src) {\r\n    return new Promise((res, rej) => {\r\n\r\n        const img = new Image()\r\n\r\n        img.onload = _ => {\r\n            img.onnerror = null;\r\n            res(img)\r\n        }\r\n        img.onerror = e => {\r\n            res(img)\r\n        }\r\n\r\n        img.src = handleImgSrc(src)\r\n    })\r\n}\r\n\n\n//# sourceURL=webpack:///./src/loadImageSrc.js?");

/***/ }),

/***/ "./src/loading_indicator_handler.js":
/*!******************************************!*\
  !*** ./src/loading_indicator_handler.js ***!
  \******************************************/
/*! exports provided: showLoadingMessage, hideLoadingMessage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"showLoadingMessage\", function() { return showLoadingMessage; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"hideLoadingMessage\", function() { return hideLoadingMessage; });\n/* harmony import */ var _MessageBarActivitySwitcher_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MessageBarActivitySwitcher.js */ \"./src/MessageBarActivitySwitcher.js\");\n\r\n\r\nconst switchLoadingMessage = new _MessageBarActivitySwitcher_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\r\n    \"#loading_message_bar\"\r\n).setHookOnActivate(\r\n    rootNode => {\r\n        rootNode.querySelector(\".message_space\").innerHTML = \"Loading images...\"\r\n        rootNode.classList.add(\"message-loading\")\r\n    }\r\n).setHookOnInactivate(\r\n    rootNode => {\r\n        rootNode.classList.remove(\"message-loading\")\r\n    }\r\n)\r\n\r\nconst showLoadingMessage = state => {\r\n    switchLoadingMessage.activate()\r\n    return state\r\n}\r\n\r\nconst hideLoadingMessage = state => {\r\n    switchLoadingMessage.inactivate()\r\n    return state\r\n}\r\n\n\n//# sourceURL=webpack:///./src/loading_indicator_handler.js?");

/***/ }),

/***/ "./src/markDownloadedOption.js":
/*!*************************************!*\
  !*** ./src/markDownloadedOption.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return markDownloadedOption; });\n/**\r\n *\r\n * @param {*} packageName\r\n * @return {Object[meta,zip]}\r\n */\r\nfunction markDownloadedOption(packageName) {\r\n    return manifest => _ => new Promise((res, rej) => {\r\n        Array.from(document.querySelectorAll(`#rock_selector>option[value=${packageName}]`)).forEach(option => {\r\n            const label = option.innerHTML.replace(\"✓ \", \"\")\r\n            option.innerHTML = \"✓ \" + label\r\n            option.classList.add(\"downloaded\")\r\n        })\r\n        res(_)\r\n    })\r\n}\r\n\n\n//# sourceURL=webpack:///./src/markDownloadedOption.js?");

/***/ }),

/***/ "./src/overrideLanguageByLocalStorage.js":
/*!***********************************************!*\
  !*** ./src/overrideLanguageByLocalStorage.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return overwrideLanguageByLocalStorage; });\nfunction overwrideLanguageByLocalStorage(state) {\r\n    const langInLocalStorage = state.localStorage.get(\"language\")\r\n    const lang = (langInLocalStorage !== undefined)\r\n        ? langInLocalStorage\r\n        : state.language;\r\n    state.language = lang\r\n    document.querySelector(\"option[value=\" + lang + \"]\").selected = true\r\n    return state\r\n}\r\n\n\n//# sourceURL=webpack:///./src/overrideLanguageByLocalStorage.js?");

/***/ }),

/***/ "./src/pinchImage.js":
/*!***************************!*\
  !*** ./src/pinchImage.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return pinchImage; });\n/* harmony import */ var _coordinate_updators_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./coordinate_updators.js */ \"./src/coordinate_updators.js\");\n/* harmony import */ var _updateMagnify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./updateMagnify.js */ \"./src/updateMagnify.js\");\n/* harmony import */ var _draw_state_updators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./draw_state_updators.js */ \"./src/draw_state_updators.js\");\n\r\n\r\n\r\n\r\nfunction pinchImage(state, e) {\r\n    return () => {\r\n        Object(_coordinate_updators_js__WEBPACK_IMPORTED_MODULE_0__[\"updateCoordinate\"])(state, e)\r\n        Object(_updateMagnify_js__WEBPACK_IMPORTED_MODULE_1__[\"updateMagnifyByPinch\"])(state, e)\r\n        Object(_draw_state_updators_js__WEBPACK_IMPORTED_MODULE_2__[\"blobToCanvas\"])(state)\r\n        Object(_draw_state_updators_js__WEBPACK_IMPORTED_MODULE_2__[\"drawHairLine\"])(state)\r\n        Object(_draw_state_updators_js__WEBPACK_IMPORTED_MODULE_2__[\"drawScale\"])(state)\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/pinchImage.js?");

/***/ }),

/***/ "./src/progress_bar_handlers.js":
/*!**************************************!*\
  !*** ./src/progress_bar_handlers.js ***!
  \**************************************/
/*! exports provided: progressLoading, completeLoading */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"progressLoading\", function() { return progressLoading; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"completeLoading\", function() { return completeLoading; });\nfunction progressLoading(selector) {\r\n    const progress = document.querySelector(selector)\r\n    const bar = progress.querySelector(\".bar\")\r\n    bar.style.width = \"0%\"\r\n    const total = progress.clientWidth\r\n    return e => {\r\n        bar.style.width = `${(e.loaded / e.total) * 100}%`\r\n    }\r\n}\r\n\r\nfunction completeLoading(selector) {\r\n    const progress = document.querySelector(selector)\r\n    const bar = progress.querySelector(\".bar\")\r\n    return e => {\r\n        bar.style.width = \"0%\"\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/progress_bar_handlers.js?");

/***/ }),

/***/ "./src/queryImagePackage.js":
/*!**********************************!*\
  !*** ./src/queryImagePackage.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return queryImagePackage; });\n/* harmony import */ var _global_objects_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global_objects.js */ \"./src/global_objects.js\");\n/* harmony import */ var _imagePackageFetcher_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./imagePackageFetcher.js */ \"./src/imagePackageFetcher.js\");\n/* harmony import */ var _sanitizeID_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sanitizeID.js */ \"./src/sanitizeID.js\");\n/* harmony import */ var _data_translaters_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./data_translaters.js */ \"./src/data_translaters.js\");\n\r\n\r\n\r\n\r\n/**\r\n * 指定したkeyのデータがDBの中にある場合, DBからデータを取得する.\r\n * サーバとDBでデータの最終更新時刻が一致すれば,\r\n *  DBのデータを返す.\r\n * ネットワークエラーの場合, DBのデータか無を返す\r\n *\r\n * そうでなければサーバからmanifestとsumbnailを取得して返す.\r\n * また, 画像本体のzipファイルをfetchするアクションを起こす関数を返す.\r\n *\r\n * @param {Object} state\r\n * @param {String} packageName\r\n * @param {String} lastModified_remote\r\n * @param {Boolean} networkDisconnected\r\n * @return {Array[Object,Boolean, function]} [response, toBeStored, zipLoader]\r\n */\r\nasync function queryImagePackage(\r\n    state,\r\n    packageName,\r\n    lastModified_remote,\r\n    networkDisconnected\r\n) {\r\n    const key = Object(_sanitizeID_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(packageName)\r\n    const storedData = await state.zipDBHandler.get(state.zipDB, key)\r\n\r\n    if (storedData !== undefined && storedData.lastModified === lastModified_remote) {\r\n        var toBeStored = false\r\n        return [storedData, toBeStored, null]\r\n    }\r\n    if (networkDisconnected) {\r\n        if (storedData !== undefined) {\r\n            var toBeStored = false\r\n            return [storedData, toBeStored, null]\r\n        } else {\r\n            return [null, false, null]\r\n        }\r\n    } else {\r\n        const manifestUrl = _global_objects_js__WEBPACK_IMPORTED_MODULE_0__[\"staticSettings\"].getImageDataPath(packageName) + \"manifest.json\";\r\n        const open_thumbnailUrl = _global_objects_js__WEBPACK_IMPORTED_MODULE_0__[\"staticSettings\"].getImageDataPath(packageName) + \"o1.jpg\";\r\n        const cross_thumbnailUrl = _global_objects_js__WEBPACK_IMPORTED_MODULE_0__[\"staticSettings\"].getImageDataPath(packageName) + \"c1.jpg\";\r\n        const zipUrl = _global_objects_js__WEBPACK_IMPORTED_MODULE_0__[\"staticSettings\"].getImageDataPath(packageName) + state.supportedImageType + \".zip\"\r\n        const response = {\r\n            manifest: await fetch(manifestUrl)\r\n                .then(response => response.text()),\r\n            thumbnail: {\r\n                \"o1.jpg\": await fetch(open_thumbnailUrl)\r\n                    .then(response => response.blob())\r\n                    .then(_data_translaters_js__WEBPACK_IMPORTED_MODULE_3__[\"blobToBase64\"]),\r\n                \"c1.jpg\": await fetch(cross_thumbnailUrl)\r\n                    .then(response => response.blob())\r\n                    .then(_data_translaters_js__WEBPACK_IMPORTED_MODULE_3__[\"blobToBase64\"])\r\n            },\r\n            id: key,\r\n            lastModified: lastModified_remote,\r\n            zip: null,\r\n        }\r\n        var toBeStored = true\r\n        const zipLoader = Object(_imagePackageFetcher_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(zipUrl)\r\n        return [response, toBeStored, zipLoader]\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/queryImagePackage.js?");

/***/ }),

/***/ "./src/queryLastModified.js":
/*!**********************************!*\
  !*** ./src/queryLastModified.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return queryLastModified; });\n/**\r\n *\r\n * @param {String} url\r\n * @return {Array[String, Boolean]} [lastModified, networkDisconnected]\r\n */\r\nasync function queryLastModified(url) {\r\n    try {\r\n        const header = await fetch(url, { method: 'HEAD' }).catch(e => {\r\n            console.log(\"Package metadata cannot be fetched.\")\r\n            throw Error(e)\r\n        })\r\n        var lastModified = header.headers.get(\"last-modified\")\r\n        var networkDisconnected = false\r\n        return [lastModified, networkDisconnected]\r\n    } catch (e) {\r\n        var lastModified = \"none\"\r\n        var networkDisconnected = true\r\n        return [lastModified, networkDisconnected]\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/queryLastModified.js?");

/***/ }),

/***/ "./src/radiunBetween.js":
/*!******************************!*\
  !*** ./src/radiunBetween.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return radiunBetween; });\nfunction radiunBetween(cx, cy) {\r\n    return (_x1, _y1, _x2, _y2) => {\r\n        const x1 = _x1 - cx\r\n        const x2 = _x2 - cx\r\n        const y1 = _y1 - cy\r\n        const y2 = _y2 - cy\r\n\r\n        const cos = (x1 * x2 + y1 * y2) / Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2))\r\n        return Math.sign(x1 * y2 - x2 * y1) * Math.acos(cos)\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/radiunBetween.js?");

/***/ }),

/***/ "./src/register.js":
/*!*************************!*\
  !*** ./src/register.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return register; });\n/* harmony import */ var _registerZip_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./registerZip.js */ \"./src/registerZip.js\");\n\r\n\r\nfunction register(state, isNewData) {\r\n    if (isNewData) {\r\n        return entry => new Promise((res, rej) => {\r\n            Object(_registerZip_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(state)(entry)\r\n                .then(res)\r\n        })\r\n    } else {\r\n        return _ => new Promise((res, rej) => {\r\n            res(state)\r\n        })\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/register.js?");

/***/ }),

/***/ "./src/registerZip.js":
/*!****************************!*\
  !*** ./src/registerZip.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return registerZip; });\n/**\r\n *\r\n * @param {*} state\r\n * @param {*} key\r\n * @return {Object[meta,zip]}\r\n */\r\nfunction registerZip(state) {\r\n    return async (entry) => {\r\n\r\n        const newOne = await state.zipDBHandler.put(state.zipDB, entry)\r\n\r\n        state.storedKeys.push(entry.id)\r\n\r\n        if (state.storedKeys.length > 20) {\r\n            const oldest = state.storedKeys.shift()\r\n            const deleted = await state.zipDBHandler.delete(state.zipDB, oldest)\r\n            Array.from(document.querySelectorAll(`#rock_selector>option[value=${oldest}]`)).forEach(option => {\r\n                const label = option.innerHTML.replace(\"✓ \", \"\")\r\n                option.innerHTML = label\r\n                option.classList.remove(\"downloaded\")\r\n            })\r\n        }\r\n\r\n        return state\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/registerZip.js?");

/***/ }),

/***/ "./src/rockNameSelectHandler.js":
/*!**************************************!*\
  !*** ./src/rockNameSelectHandler.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return rockNameSelectHandler; });\n/* harmony import */ var _error_indicator_handler_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./error_indicator_handler.js */ \"./src/error_indicator_handler.js\");\n/* harmony import */ var _loading_indicator_handler_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./loading_indicator_handler.js */ \"./src/loading_indicator_handler.js\");\n/* harmony import */ var _viewer_handlers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./viewer_handlers.js */ \"./src/viewer_handlers.js\");\n/* harmony import */ var _getPackageMetaData_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getPackageMetaData.js */ \"./src/getPackageMetaData.js\");\n/* harmony import */ var _updateStateByMeta_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./updateStateByMeta.js */ \"./src/updateStateByMeta.js\");\n/* harmony import */ var _updateViewDiscription_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./updateViewDiscription.js */ \"./src/updateViewDiscription.js\");\n/* harmony import */ var _updateImageSrc_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./updateImageSrc.js */ \"./src/updateImageSrc.js\");\n/* harmony import */ var _fetchImagePackage_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./fetchImagePackage.js */ \"./src/fetchImagePackage.js\");\n/* harmony import */ var _register_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./register.js */ \"./src/register.js\");\n/* harmony import */ var _markDownloadedOption_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./markDownloadedOption.js */ \"./src/markDownloadedOption.js\");\n/* harmony import */ var _updateView_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./updateView.js */ \"./src/updateView.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nfunction rockNameSelectHandler(state) {\r\n    return new Promise(async (res, rej) => {\r\n        const rock_selector = document.querySelector(\"#rock_selector\")\r\n        const packageName = rock_selector.options[rock_selector.selectedIndex].value\r\n\r\n        state.canRotate = false;\r\n        Object(_error_indicator_handler_js__WEBPACK_IMPORTED_MODULE_0__[\"hideErrorMessage\"])()\r\n        Object(_loading_indicator_handler_js__WEBPACK_IMPORTED_MODULE_1__[\"showLoadingMessage\"])()\r\n        Object(_viewer_handlers_js__WEBPACK_IMPORTED_MODULE_2__[\"hideWelcomeBoard\"])()\r\n        Object(_viewer_handlers_js__WEBPACK_IMPORTED_MODULE_2__[\"showViewer\"])()\r\n        Object(_viewer_handlers_js__WEBPACK_IMPORTED_MODULE_2__[\"showNicolButton\"])()\r\n\r\n        /**\r\n         * fetch lastmodified\r\n         * fetch manifest\r\n         * fetch sumbnail\r\n         *\r\n         * show sumbnail\r\n         * show discription\r\n         *\r\n         * load images\r\n         *  from db\r\n         *  fetch\r\n         *\r\n         * store data\r\n         */\r\n\r\n        try {\r\n            const [response, isNewData, zipLoader] = await Object(_getPackageMetaData_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(state, packageName);\r\n            const manifest = JSON.parse(response.manifest);\r\n\r\n            const [new_state, new_response] = await Object(_updateStateByMeta_js__WEBPACK_IMPORTED_MODULE_4__[\"default\"])(state)(packageName, manifest)\r\n                .then(_updateViewDiscription_js__WEBPACK_IMPORTED_MODULE_5__[\"default\"])\r\n                .then(Object(_updateImageSrc_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"])(response.thumbnail, \"jpg\"))\r\n                .then(_updateView_js__WEBPACK_IMPORTED_MODULE_10__[\"default\"])\r\n                .then(Object(_fetchImagePackage_js__WEBPACK_IMPORTED_MODULE_7__[\"default\"])(zipLoader, response, isNewData))\r\n\r\n            new_state.canRotate = true\r\n\r\n            Object(_updateImageSrc_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"])(new_response.zip, new_state.supportedImageType)(new_state)\r\n                .then(state => Object(_register_js__WEBPACK_IMPORTED_MODULE_8__[\"default\"])(state, isNewData)(new_response)\r\n                )\r\n                .then(Object(_markDownloadedOption_js__WEBPACK_IMPORTED_MODULE_9__[\"default\"])(packageName)(manifest))\r\n                .then(_updateView_js__WEBPACK_IMPORTED_MODULE_10__[\"default\"])\r\n                .then(res)\r\n        } catch (e) {\r\n            rej(e)\r\n        }\r\n    })\r\n}\r\n\n\n//# sourceURL=webpack:///./src/rockNameSelectHandler.js?");

/***/ }),

/***/ "./src/rotateImage.js":
/*!****************************!*\
  !*** ./src/rotateImage.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return rotateImage; });\n/* harmony import */ var _coordinate_updators_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./coordinate_updators.js */ \"./src/coordinate_updators.js\");\n/* harmony import */ var _draw_state_updators_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./draw_state_updators.js */ \"./src/draw_state_updators.js\");\n\r\n\r\n\r\nfunction rotateImage(state, e) {\r\n    return () => {\r\n        Object(_coordinate_updators_js__WEBPACK_IMPORTED_MODULE_0__[\"updateCoordinate\"])(state, e)\r\n        Object(_coordinate_updators_js__WEBPACK_IMPORTED_MODULE_0__[\"updateRotate\"])(state, e)\r\n        Object(_draw_state_updators_js__WEBPACK_IMPORTED_MODULE_1__[\"blobToCanvas\"])(state)\r\n        Object(_draw_state_updators_js__WEBPACK_IMPORTED_MODULE_1__[\"drawHairLine\"])(state)\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/rotateImage.js?");

/***/ }),

/***/ "./src/rotation_degree_handlers.js":
/*!*****************************************!*\
  !*** ./src/rotation_degree_handlers.js ***!
  \*****************************************/
/*! exports provided: stepBy, cycleBy, mirrorBy, isInverse, rotateSign */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"stepBy\", function() { return stepBy; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cycleBy\", function() { return cycleBy; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"mirrorBy\", function() { return mirrorBy; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isInverse\", function() { return isInverse; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"rotateSign\", function() { return rotateSign; });\nconst stepBy = unit => val => Math.floor(val / unit)\r\n\r\nconst cycleBy = unit => val => {\r\n    const cycle_count = Math.floor(val / unit)\r\n    return val < 0\r\n        ? val + unit\r\n        : (unit <= val)\r\n            ? val - unit * cycle_count\r\n            : val\r\n}\r\n\r\nconst mirrorBy = (center) => val => val > center ? 2 * center - val : val\r\n\r\nconst isInverse = degree => (180 <= degree)\r\n\r\nconst rotateSign = (clockwise = true) => clockwise ? -1 : 1\r\n\n\n//# sourceURL=webpack:///./src/rotation_degree_handlers.js?");

/***/ }),

/***/ "./src/sampleListLoader.js":
/*!*********************************!*\
  !*** ./src/sampleListLoader.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return sampleListLoader; });\n/* harmony import */ var _sampleListPresenter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sampleListPresenter.js */ \"./src/sampleListPresenter.js\");\n/* harmony import */ var _global_objects_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./global_objects.js */ \"./src/global_objects.js\");\n/* harmony import */ var _error_indicator_handler_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./error_indicator_handler.js */ \"./src/error_indicator_handler.js\");\n\r\n\r\n\r\n\r\nfunction sampleListLoader(state) {\r\n    return new Promise(async (res, rej) => {\r\n        const listURL = _global_objects_js__WEBPACK_IMPORTED_MODULE_1__[\"staticSettings\"].getSampleListURL();\r\n        try {\r\n            var response = await fetch(listURL)\r\n                .catch((e) => { throw Error(e) })\r\n                .then(r => r.json())\r\n            state.localStorage.put(\"list_of_sample\", JSON.stringify(response[\"list_of_sample\"]))\r\n        } catch (e) {\r\n            var stored_list = state.localStorage.get(\"list_of_sample\")\r\n            var response = { \"list_of_sample\": JSON.parse(stored_list) }\r\n            console.warn(e)\r\n            Object(_error_indicator_handler_js__WEBPACK_IMPORTED_MODULE_2__[\"showErrorMessage\"])(\"<p>Internet disconnected.</p>\")()\r\n        }\r\n\r\n        Object(_sampleListPresenter_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(state)(response)\r\n            .then(_ => res(state))\r\n            .catch(rej)\r\n    })\r\n}\r\n\n\n//# sourceURL=webpack:///./src/sampleListLoader.js?");

/***/ }),

/***/ "./src/sampleListPresenter.js":
/*!************************************!*\
  !*** ./src/sampleListPresenter.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return sampleListPresenter; });\n/**\r\n * サンプルリストをselectタグ内に追加する\r\n * @param {*} state\r\n */\r\nfunction sampleListPresenter(state) {\r\n    return response => new Promise(async (res, rej) => {\r\n\r\n        const savedSampleNames = state.storedKeys;\r\n\r\n        const sampleList = response[\"list_of_sample\"];\r\n        const sampleSelectDOM = document.querySelector(\"#rock_selector\");\r\n        sampleSelectDOM.innerHTML = \"<option value='' disabled selected style='display:none;'>Select sample</option>\";\r\n        const options = sampleList.map(v => {\r\n            const option = document.createElement(\"option\")\r\n            option.value = v[\"package-name\"];\r\n            option.innerHTML = (savedSampleNames.includes(v[\"package-name\"]) ? \"✓ \" : \"\") + v[\"list-name\"][state.language]\r\n            if (savedSampleNames.includes(v[\"package-name\"])) {\r\n                option.classList.add(\"downloaded\")\r\n            }\r\n            return option\r\n        })\r\n        options.forEach(v => {\r\n            sampleSelectDOM.appendChild(v)\r\n        })\r\n\r\n        document.querySelector(\"#top-navigation\").classList.add(\"isready\");\r\n        sampleSelectDOM.classList.add(\"isready\")\r\n        res(response);\r\n    })\r\n}\r\n\n\n//# sourceURL=webpack:///./src/sampleListPresenter.js?");

/***/ }),

/***/ "./src/sanitizeID.js":
/*!***************************!*\
  !*** ./src/sanitizeID.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return sanitizeID; });\nfunction sanitizeID(id) {\r\n    return id.replace(/\\//g, \"_\").replace(/\\./g, \"\")\r\n}\r\n\n\n//# sourceURL=webpack:///./src/sanitizeID.js?");

/***/ }),

/***/ "./src/selectFromMultiLanguage.js":
/*!****************************************!*\
  !*** ./src/selectFromMultiLanguage.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return selectFromMultiLanguage; });\n/**\r\n *\r\n * @param {String,Object[String,String]} multiLanguageTextObj\r\n * @return {String}\r\n */\r\nfunction selectFromMultiLanguage(multiLanguageTextObj, languageCode) {\r\n    if (typeof (multiLanguageTextObj) === \"string\") {\r\n        return multiLanguageTextObj\r\n    } else if (typeof (multiLanguageTextObj) === \"object\") {\r\n        if (multiLanguageTextObj.hasOwnProperty(languageCode)) {\r\n            return multiLanguageTextObj[languageCode]\r\n        } else {\r\n            const keys = Object.keys(multiLanguageTextObj)\r\n            return (keys.length > 0)\r\n                ? multiLanguageTextObj[keys[0]]\r\n                : \"\"\r\n        }\r\n    } else {\r\n        return \"\"\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/selectFromMultiLanguage.js?");

/***/ }),

/***/ "./src/selectLanguageCode.js":
/*!***********************************!*\
  !*** ./src/selectLanguageCode.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return selectLanguageCode; });\nfunction selectLanguageCode() {\r\n    const code = (window.navigator.languages && window.navigator.languages[0]) ||\r\n        window.navigator.language ||\r\n        window.navigator.userLanguage ||\r\n        window.navigator.browserLanguage;\r\n\r\n    const lang = code.match(\"ja\") ? \"ja\" : \"en\";\r\n\r\n    return lang\r\n}\r\n\n\n//# sourceURL=webpack:///./src/selectLanguageCode.js?");

/***/ }),

/***/ "./src/sendContactMessage.js":
/*!***********************************!*\
  !*** ./src/sendContactMessage.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return sendContactMessage; });\nasync function sendContactMessage(e, messageDOM) {\r\n\r\n    const button = e.target\r\n    button.classList.add(\"pending\")\r\n\r\n    messageDOM.classList.add(\"inactive\")\r\n    messageDOM.classList.remove(\"success\")\r\n    messageDOM.classList.remove(\"error\")\r\n\r\n    const form = document.querySelector(\"#form-contact\")\r\n    const selection = form.querySelector(\"#select-contact_topic\")\r\n    const topic = selection[selection.selectedIndex].value\r\n    const message = form.querySelector(\"textarea\").value\r\n    const from = form.querySelector(\"input[type=email\").value\r\n\r\n    if (topic === \"\") {\r\n        button.classList.remove(\"pending\")\r\n        messageDOM.innerHTML = \"Select topic !\"\r\n        messageDOM.classList.add(\"error\")\r\n        messageDOM.classList.remove(\"inactive\")\r\n        return false\r\n    }\r\n\r\n    if (message === undefined || message == \"\") {\r\n        button.classList.remove(\"pending\")\r\n        messageDOM.innerHTML = \"Write message !\"\r\n        messageDOM.classList.add(\"error\")\r\n        messageDOM.classList.remove(\"inactive\")\r\n        return false\r\n    }\r\n\r\n    const obj = {\r\n        \"from\": from,\r\n        \"title\": topic,\r\n        \"body\": message\r\n    }\r\n\r\n    const method = \"POST\";\r\n    const body = JSON.stringify(obj);\r\n    const headers = {\r\n        'Accept': 'text/plain,application/json',\r\n        'Access-Control-Allow-Origin': '*',\r\n        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',\r\n\r\n    };\r\n\r\n    console.log({ method, headers, body })\r\n\r\n    try {\r\n        const response = await fetch(\"https://dgo96yhuni.execute-api.us-east-1.amazonaws.com/contactapi/contact\", { method, headers, body, 'mode': 'no-cors' })\r\n        messageDOM.innerHTML = \"Success. Thank you for contributing !\"\r\n        messageDOM.classList.add(\"success\")\r\n        messageDOM.classList.remove(\"inactive\")\r\n    } catch (e) {\r\n        console.log(e)\r\n        messageDOM.innerHTML = \"Network error !\"\r\n        messageDOM.classList.add(\"error\")\r\n        messageDOM.classList.remove(\"inactive\")\r\n    }\r\n    button.classList.remove(\"pending\")\r\n\r\n    return false\r\n}\r\n\n\n//# sourceURL=webpack:///./src/sendContactMessage.js?");

/***/ }),

/***/ "./src/setCanvasEventHandlers.js":
/*!***************************************!*\
  !*** ./src/setCanvasEventHandlers.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return setCanvasEventHandlers; });\n/* harmony import */ var _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./viewer_canvas.js */ \"./src/viewer_canvas.js\");\n/* harmony import */ var _touchEventHandlers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./touchEventHandlers.js */ \"./src/touchEventHandlers.js\");\n/* harmony import */ var _wheelEventHandler_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./wheelEventHandler.js */ \"./src/wheelEventHandler.js\");\n\r\n\r\n\r\n\r\nfunction setCanvasEventHandlers(state) {\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_0__[\"viewer\"].addEventListener(\r\n        \"mousedown\",\r\n        Object(_touchEventHandlers_js__WEBPACK_IMPORTED_MODULE_1__[\"touchStartHandler\"])(state),\r\n        false\r\n    )\r\n\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_0__[\"viewer\"].addEventListener(\r\n        \"dragstart\",\r\n        e => { e.preventDefault() },\r\n        false\r\n    )\r\n\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_0__[\"viewer\"].addEventListener(\r\n        \"drag\",\r\n        e => { e.preventDefault() },\r\n        false\r\n    )\r\n\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_0__[\"viewer\"].addEventListener(\r\n        \"dragend\",\r\n        e => { e.preventDefault() },\r\n        false\r\n    )\r\n\r\n\r\n\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_0__[\"viewer\"].addEventListener(\r\n        \"touchstart\",\r\n        Object(_touchEventHandlers_js__WEBPACK_IMPORTED_MODULE_1__[\"touchStartHandler\"])(state),\r\n        false\r\n    )\r\n\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_0__[\"viewer\"].addEventListener(\r\n        \"mousemove\",\r\n        Object(_touchEventHandlers_js__WEBPACK_IMPORTED_MODULE_1__[\"touchMoveHandler\"])(state),\r\n        false\r\n    )\r\n\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_0__[\"viewer\"].addEventListener(\r\n        \"touchmove\",\r\n        Object(_touchEventHandlers_js__WEBPACK_IMPORTED_MODULE_1__[\"touchMoveHandler\"])(state),\r\n        false\r\n    )\r\n\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_0__[\"viewer\"].addEventListener(\r\n        \"mouseup\",\r\n        Object(_touchEventHandlers_js__WEBPACK_IMPORTED_MODULE_1__[\"touchEndHandler\"])(state),\r\n        false\r\n    )\r\n\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_0__[\"viewer\"].addEventListener(\r\n        \"touchend\",\r\n        Object(_touchEventHandlers_js__WEBPACK_IMPORTED_MODULE_1__[\"touchEndHandler\"])(state),\r\n        false\r\n    )\r\n\r\n    _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_0__[\"viewer\"].addEventListener(\r\n        \"wheel\",\r\n        Object(_wheelEventHandler_js__WEBPACK_IMPORTED_MODULE_2__[\"wheelHandler\"])(state),\r\n        false\r\n    )\r\n}\r\n\n\n//# sourceURL=webpack:///./src/setCanvasEventHandlers.js?");

/***/ }),

/***/ "./src/setContactFormEventHandlers.js":
/*!********************************************!*\
  !*** ./src/setContactFormEventHandlers.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return setContactFormEventHandlers; });\n/* harmony import */ var _sendContactMessage_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sendContactMessage.js */ \"./src/sendContactMessage.js\");\n\r\n\r\nfunction setContactFormEventHandlers(state) {\r\n    document.querySelector(\"#form-contact div.button\").addEventListener(\r\n        \"click\",\r\n        e => (Array.from(e.target.classList).includes(\"pending\"))\r\n            ? null\r\n            : Object(_sendContactMessage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\r\n                e,\r\n                document.querySelector(\"#form-contact .form-message\")\r\n            ),\r\n        false\r\n    )\r\n}\r\n\n\n//# sourceURL=webpack:///./src/setContactFormEventHandlers.js?");

/***/ }),

/***/ "./src/setLanguageSelectEventHandlers.js":
/*!***********************************************!*\
  !*** ./src/setLanguageSelectEventHandlers.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return setLanguageSelectEventHandlers; });\n/* harmony import */ var _languageChangeHandler_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./languageChangeHandler.js */ \"./src/languageChangeHandler.js\");\n/* harmony import */ var _sampleListLoader_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sampleListLoader.js */ \"./src/sampleListLoader.js\");\n/* harmony import */ var _updateViewDiscription_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./updateViewDiscription.js */ \"./src/updateViewDiscription.js\");\n\r\n\r\n\r\n\r\nfunction setLanguageSelectEventHandlers(state) {\r\n    const languageSelector = document.querySelector(\"#language_selector\")\r\n\r\n    languageSelector.addEventListener(\"change\",\r\n        e => Object(_languageChangeHandler_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(state)(e)\r\n            .then(_sampleListLoader_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])\r\n            .then(_updateViewDiscription_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"]),\r\n        false\r\n    )\r\n}\r\n\n\n//# sourceURL=webpack:///./src/setLanguageSelectEventHandlers.js?");

/***/ }),

/***/ "./src/setOpenAndCrossImages.js":
/*!**************************************!*\
  !*** ./src/setOpenAndCrossImages.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return setOpenAndCrossImages; });\nfunction setOpenAndCrossImages(state) {\r\n    return imgSets => new Promise((res, rej) => {\r\n        state.open_images = imgSets.open\r\n        state.cross_images = imgSets.cross\r\n        res(state)\r\n    })\r\n}\r\n\n\n//# sourceURL=webpack:///./src/setOpenAndCrossImages.js?");

/***/ }),

/***/ "./src/setRockSelectEventHandlers.js":
/*!*******************************************!*\
  !*** ./src/setRockSelectEventHandlers.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return setRockSelectEventHandlers; });\n/* harmony import */ var _rockNameSelectHandler_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rockNameSelectHandler.js */ \"./src/rockNameSelectHandler.js\");\n/* harmony import */ var _updateView_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./updateView.js */ \"./src/updateView.js\");\n/* harmony import */ var _error_indicator_handler_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./error_indicator_handler.js */ \"./src/error_indicator_handler.js\");\n/* harmony import */ var _loading_indicator_handler_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./loading_indicator_handler.js */ \"./src/loading_indicator_handler.js\");\n\r\n\r\n\r\n\r\n\r\nfunction setRockSelectEventHandlers(state) {\r\n    const rock_selector = document.querySelector(\"#rock_selector\")\r\n\r\n    rock_selector.addEventListener(\r\n        \"change\",\r\n        e => {\r\n            Object(_rockNameSelectHandler_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(state)\r\n                .then(_updateView_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])\r\n                .then(_error_indicator_handler_js__WEBPACK_IMPORTED_MODULE_2__[\"hideErrorMessage\"])\r\n                .then(_loading_indicator_handler_js__WEBPACK_IMPORTED_MODULE_3__[\"hideLoadingMessage\"])\r\n                .catch(e => {\r\n                    console.log(\"Sample cannot be loaded because of network error.\")\r\n                    Object(_error_indicator_handler_js__WEBPACK_IMPORTED_MODULE_2__[\"showErrorMessage\"])(\"Internet disconnected.\")(e)\r\n                })\r\n        },\r\n        false\r\n    )\r\n}\r\n\n\n//# sourceURL=webpack:///./src/setRockSelectEventHandlers.js?");

/***/ }),

/***/ "./src/setToggleNicolEvents.js":
/*!*************************************!*\
  !*** ./src/setToggleNicolEvents.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return setToggleNicolEvents; });\n/* harmony import */ var _updateView_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./updateView.js */ \"./src/updateView.js\");\n\r\n\r\nfunction setToggleNicolEvents(state) {\r\n\r\n    const toggleNicolButton = document.querySelector(\"#change_nicol\")\r\n    const toggleNicolLabel = document.querySelector(\"#change_nicol + label\")\r\n\r\n    const toggleNicolHandler = state => new Promise((res, rej) => {\r\n\r\n        toggleNicolButton.checked = state.isCrossNicol\r\n        state.isCrossNicol = !state.isCrossNicol;\r\n\r\n\r\n        res(state)\r\n    })\r\n\r\n    toggleNicolButton.addEventListener(\r\n        \"click\",\r\n        e => { e.preventDefault() },\r\n        false\r\n    )\r\n\r\n\r\n    toggleNicolLabel.addEventListener(\r\n        \"touch\",\r\n        e => { e.preventDefault() },\r\n        false\r\n    )\r\n\r\n    toggleNicolButton.addEventListener(\r\n        \"touch\",\r\n        e => { e.preventDefault() },\r\n        false\r\n    )\r\n\r\n\r\n    toggleNicolLabel.addEventListener(\r\n        \"mouseup\",\r\n        e => toggleNicolHandler(state)\r\n            .then(_updateView_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]),\r\n        false\r\n    )\r\n\r\n    toggleNicolLabel.addEventListener(\r\n        \"touchend\",\r\n        e => toggleNicolHandler(state)\r\n            .then(_updateView_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\r\n            .then(_ => {\r\n                if (e.cancelable) {\r\n                    e.preventDefault();\r\n                }\r\n            }),\r\n        false\r\n    )\r\n}\r\n\n\n//# sourceURL=webpack:///./src/setToggleNicolEvents.js?");

/***/ }),

/***/ "./src/touchEventHandlers.js":
/*!***********************************!*\
  !*** ./src/touchEventHandlers.js ***!
  \***********************************/
/*! exports provided: touchStartHandler, touchMoveHandler, touchEndHandler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"touchStartHandler\", function() { return touchStartHandler; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"touchMoveHandler\", function() { return touchMoveHandler; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"touchEndHandler\", function() { return touchEndHandler; });\n/* harmony import */ var _coordinate_updators_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./coordinate_updators.js */ \"./src/coordinate_updators.js\");\n/* harmony import */ var _rotateImage_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rotateImage.js */ \"./src/rotateImage.js\");\n/* harmony import */ var _pinchImage_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pinchImage.js */ \"./src/pinchImage.js\");\n\r\n\r\n\r\n\r\nconst touchStartHandler = state => e => {\r\n    state.isMousedown = true\r\n    state.drag_end = Object(_coordinate_updators_js__WEBPACK_IMPORTED_MODULE_0__[\"canvasCoordinate\"])(e)\r\n    e.preventDefault();\r\n}\r\n\r\nconst touchMoveHandler = state => e => {\r\n    if (!state.isMousedown) return\r\n    if (e instanceof MouseEvent || e.touches.length === 1) {\r\n        e.preventDefault();\r\n        requestAnimationFrame(\r\n            Object(_rotateImage_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(state, e)\r\n        )\r\n    } else if (e.touches.length === 2) {\r\n        e.preventDefault()\r\n        requestAnimationFrame(\r\n            Object(_pinchImage_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(state, e)\r\n        )\r\n    }\r\n}\r\n\r\nconst touchEndHandler = state => e => {\r\n    state.isMousedown = false\r\n    state.drag_end = undefined\r\n    state.pinch_end = undefined\r\n    e.preventDefault()\r\n}\r\n\n\n//# sourceURL=webpack:///./src/touchEventHandlers.js?");

/***/ }),

/***/ "./src/unzipper.js":
/*!*************************!*\
  !*** ./src/unzipper.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return unzipper; });\n/* harmony import */ var _progress_bar_handlers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./progress_bar_handlers.js */ \"./src/progress_bar_handlers.js\");\n\r\n\r\nfunction unzipper(url) {\r\n    return new Promise((res, rej) => {\r\n\r\n        Zip.inflate_file(url, res, rej, Object(_progress_bar_handlers_js__WEBPACK_IMPORTED_MODULE_0__[\"progressLoading\"])(\"#progress_bar\"), Object(_progress_bar_handlers_js__WEBPACK_IMPORTED_MODULE_0__[\"completeLoading\"])(\"#progress_bar\"))\r\n    })\r\n}\r\n\n\n//# sourceURL=webpack:///./src/unzipper.js?");

/***/ }),

/***/ "./src/updateImageSrc.js":
/*!*******************************!*\
  !*** ./src/updateImageSrc.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return updateImageSrc; });\n/* harmony import */ var _setOpenAndCrossImages_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setOpenAndCrossImages.js */ \"./src/setOpenAndCrossImages.js\");\n/* harmony import */ var _loadImageSrc_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./loadImageSrc.js */ \"./src/loadImageSrc.js\");\n\r\n\r\n\r\nfunction selectImageInContainor(containor, prefix) {\r\n    if (prefix in containor) {\r\n        return containor[prefix]\r\n    }\r\n    return \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=\"\r\n}\r\n\r\nfunction updateImageSrc(imagesMap, type) {\r\n    return (state) => new Promise(async (res, rej) => {\r\n\r\n        Promise.all([\r\n            Promise.all(Array(state.image_number - 1).fill(0)\r\n                .map((_, i) => selectImageInContainor(imagesMap, `o${i + 1}.${type}`))\r\n                .map(_loadImageSrc_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])\r\n            ),\r\n            Promise.all(Array(state.image_number - 1).fill(0)\r\n                .map((_, i) => selectImageInContainor(imagesMap, `c${i + 1}.${type}`))\r\n                .map(_loadImageSrc_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])\r\n            )\r\n        ]).then(imgDOMs => {\r\n            const open_imgs = imgDOMs[0]\r\n\r\n            const cross_imgs = imgDOMs[1]\r\n\r\n            return { open: open_imgs, cross: cross_imgs }\r\n        })\r\n            .then(Object(_setOpenAndCrossImages_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(state))\r\n            .then(res)\r\n    })\r\n}\r\n\n\n//# sourceURL=webpack:///./src/updateImageSrc.js?");

/***/ }),

/***/ "./src/updateMagnify.js":
/*!******************************!*\
  !*** ./src/updateMagnify.js ***!
  \******************************/
/*! exports provided: updateMagnifyByPinch, updateMagnifyByWheel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"updateMagnifyByPinch\", function() { return updateMagnifyByPinch; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"updateMagnifyByWheel\", function() { return updateMagnifyByWheel; });\n/* harmony import */ var _coordinate_updators_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./coordinate_updators.js */ \"./src/coordinate_updators.js\");\n\r\n\r\nfunction updateMagnifyByPinch(state, e) {\r\n    if (state.drag_start === undefined) return\r\n    if (state.pinch_start === undefined) return\r\n\r\n    const x1 = [...state.drag_start]\r\n    const y1 = [...state.pinch_start]\r\n    const x2 = [...state.drag_end]\r\n    const y2 = [...state.pinch_end]\r\n\r\n    const expansion = Math.sqrt((x2[0] - y2[0]) ** 2 + (x2[1] - y2[1]) ** 2) / Math.sqrt((x1[0] - y1[0]) ** 2 + (x1[1] - y1[1]) ** 2)\r\n\r\n    const newRadius = (expansion > 2)\r\n        ? state.imageRadius\r\n        : state.imageRadius / expansion\r\n    state.imageRadius = (newRadius) > state.imageRadiusOriginal\r\n        ? state.imageRadiusOriginal\r\n        : (newRadius < 100)\r\n            ? 100\r\n            : newRadius\r\n    return state\r\n}\r\n\r\nfunction updateMagnifyByWheel(state, e) {\r\n    const scrolled = Object(_coordinate_updators_js__WEBPACK_IMPORTED_MODULE_0__[\"canvasCoordinate\"])(e)[1]\r\n\r\n    const newRadius = state.imageRadius + scrolled\r\n    state.imageRadius = (newRadius) > state.imageRadiusOriginal\r\n        ? state.imageRadiusOriginal\r\n        : (newRadius < 100)\r\n            ? 100\r\n            : newRadius\r\n    return state\r\n}\r\n\n\n//# sourceURL=webpack:///./src/updateMagnify.js?");

/***/ }),

/***/ "./src/updateStateByMeta.js":
/*!**********************************!*\
  !*** ./src/updateStateByMeta.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return updateStateByMeta; });\n/* harmony import */ var _sanitizeID_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sanitizeID.js */ \"./src/sanitizeID.js\");\n/* harmony import */ var _rotation_degree_handlers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rotation_degree_handlers.js */ \"./src/rotation_degree_handlers.js\");\n\r\n\r\n\r\nfunction getRotationCenter(meta) {\r\n    return (meta.hasOwnProperty(\"rotate_center\"))\r\n        ? {\r\n            \"to_right\": meta.rotate_center[0],\r\n            \"to_bottom\": meta.rotate_center[1]\r\n        }\r\n        : {\r\n            \"to_right\": meta.image_width * 0.5,\r\n            \"to_bottom\": meta.image_height * 0.5\r\n        }\r\n}\r\n\r\nfunction getImageRadius(meta) {\r\n    const shift = getRotationCenter(meta);\r\n    const image_center = {\r\n        \"x\": meta.image_width * 0.5,\r\n        \"y\": meta.image_height * 0.5\r\n    }\r\n    return Math.min(\r\n        image_center.x - Math.abs(image_center.x - shift.to_right),\r\n        image_center.y - Math.abs(image_center.y - shift.to_bottom)\r\n    )\r\n}\r\n\r\nfunction updateStateByMeta(state) {\r\n    return (containorID, meta) => new Promise((res, rej) => {\r\n\r\n        state.containorID = Object(_sanitizeID_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(containorID);\r\n        state.isClockwise = meta.rotate_clockwise\r\n        state.location = (meta.hasOwnProperty(\"location\"))\r\n            ? meta.location\r\n            : \"Unknown\"\r\n        state.rockType = (meta.hasOwnProperty(\"rock_type\"))\r\n            ? meta.rock_type\r\n            : \"Unknown\"\r\n        state.owner = (meta.hasOwnProperty(\"owner\"))\r\n            ? meta.owner\r\n            : \"Unknown\"\r\n        state.discription = (meta.hasOwnProperty(\"discription\"))\r\n            ? meta.discription\r\n            : \"No discription. \"\r\n        state.rotate_center = getRotationCenter(meta)\r\n\r\n        state.imageWidth = meta.image_width;\r\n        state.imageHeight = meta.image_height;\r\n\r\n\r\n\r\n        state.imageRadius = getImageRadius(meta)\r\n        state.imageRadiusOriginal = getImageRadius(meta)\r\n        state.scaleWidth = (meta.hasOwnProperty(\"scale-pixel\"))\r\n            ? parseInt(meta[\"scale-pixel\"])\r\n            : false\r\n        state.scaleText = (meta.hasOwnProperty(\"scale-unit\"))\r\n            ? meta[\"scale-unit\"]\r\n            : false\r\n\r\n\r\n        const rotate_degree_step = meta.rotate_by_degree\r\n        const cycle_degree = meta.hasOwnProperty(\"cycle_rotate_degree\")\r\n            ? parseInt(meta.cycle_rotate_degree)\r\n            : 90;\r\n        const image_number = cycle_degree / rotate_degree_step + 1\r\n        state.image_number = image_number\r\n        const mirror_at = (image_number - 1)\r\n        const total_step = (image_number - 1) * 2\r\n\r\n        state.getImageNumber = cycle_degree > 0\r\n            ? degree => Object(_rotation_degree_handlers_js__WEBPACK_IMPORTED_MODULE_1__[\"cycleBy\"])(image_number - 1)(\r\n                Object(_rotation_degree_handlers_js__WEBPACK_IMPORTED_MODULE_1__[\"stepBy\"])(rotate_degree_step)(state.isClockwise ? 360 - degree : degree)\r\n            )\r\n            : degree => mirrorBy(mirror_at)(\r\n                Object(_rotation_degree_handlers_js__WEBPACK_IMPORTED_MODULE_1__[\"cycleBy\"])(total_step)(\r\n                    Object(_rotation_degree_handlers_js__WEBPACK_IMPORTED_MODULE_1__[\"stepBy\"])(rotate_degree_step)(degree)\r\n                )\r\n            )\r\n\r\n        state.getAlpha = degree => {\r\n            const nth = Object(_rotation_degree_handlers_js__WEBPACK_IMPORTED_MODULE_1__[\"cycleBy\"])(total_step * 2)(\r\n                Object(_rotation_degree_handlers_js__WEBPACK_IMPORTED_MODULE_1__[\"stepBy\"])(rotate_degree_step)(degree)\r\n            )\r\n            return 1 - (degree - rotate_degree_step * nth) / rotate_degree_step\r\n        }\r\n\r\n        state.open_images = []\r\n        state.cross_images = []\r\n\r\n        state.rotate = 0;\r\n\r\n        res(state)\r\n    })\r\n}\r\n\n\n//# sourceURL=webpack:///./src/updateStateByMeta.js?");

/***/ }),

/***/ "./src/updateView.js":
/*!***************************!*\
  !*** ./src/updateView.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return updateView; });\n/* harmony import */ var _draw_state_updators_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./draw_state_updators.js */ \"./src/draw_state_updators.js\");\n\r\n\r\nfunction updateView(state) {\r\n    Object(_draw_state_updators_js__WEBPACK_IMPORTED_MODULE_0__[\"clearView\"])(state)\r\n    Object(_draw_state_updators_js__WEBPACK_IMPORTED_MODULE_0__[\"blobToCanvas\"])(state)\r\n    Object(_draw_state_updators_js__WEBPACK_IMPORTED_MODULE_0__[\"drawHairLine\"])(state)\r\n    Object(_draw_state_updators_js__WEBPACK_IMPORTED_MODULE_0__[\"drawScale\"])(state)\r\n    return state\r\n}\r\n\n\n//# sourceURL=webpack:///./src/updateView.js?");

/***/ }),

/***/ "./src/updateViewDiscription.js":
/*!**************************************!*\
  !*** ./src/updateViewDiscription.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return updateViewDiscription; });\n/* harmony import */ var _selectFromMultiLanguage_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./selectFromMultiLanguage.js */ \"./src/selectFromMultiLanguage.js\");\n\r\n\r\nfunction updateViewDiscription(state) {\r\n    const discriptionBox = document.querySelector(\"#view_discription\")\r\n    const lang = state.language\r\n\r\n    const rockFrom = `${Object(_selectFromMultiLanguage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(state.rockType, lang)} ${state.location ? \"(\" + Object(_selectFromMultiLanguage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(state.location, lang) + \")\" : \"\"}`\r\n    const rockDisc = Object(_selectFromMultiLanguage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(state.discription, lang)\r\n    const rockOwner = Object(_selectFromMultiLanguage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(state.owner, lang)\r\n\r\n    const textTemplate = `<ul style=\"list-style-type:none;\">\r\n            <li>${rockFrom}</li>\r\n            <li>${rockDisc}</li>\r\n            <li>${rockOwner}</li>\r\n        </ul>`\r\n\r\n    discriptionBox.innerHTML = textTemplate;\r\n    return state\r\n}\r\n\n\n//# sourceURL=webpack:///./src/updateViewDiscription.js?");

/***/ }),

/***/ "./src/viewer_canvas.js":
/*!******************************!*\
  !*** ./src/viewer_canvas.js ***!
  \******************************/
/*! exports provided: viewer, viewer_ctx */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"viewer\", function() { return viewer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"viewer_ctx\", function() { return viewer_ctx; });\nconst viewer = document.querySelector(\"#main-viewer\")\r\nconst viewer_ctx = viewer.getContext(\"2d\")\r\n\n\n//# sourceURL=webpack:///./src/viewer_canvas.js?");

/***/ }),

/***/ "./src/viewer_handlers.js":
/*!********************************!*\
  !*** ./src/viewer_handlers.js ***!
  \********************************/
/*! exports provided: hideWelcomeBoard, showViewer, showNicolButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"hideWelcomeBoard\", function() { return hideWelcomeBoard; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"showViewer\", function() { return showViewer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"showNicolButton\", function() { return showNicolButton; });\n\r\n\r\nconst hideWelcomeBoard = state => {\r\n    const board = document.querySelector(\"#welcome-card\")\r\n    board.classList.add(\"inactive\");\r\n    return state\r\n}\r\n\r\nconst showViewer = state => {\r\n    const card = document.querySelector(\"#viewer_wrapper\")\r\n    card.classList.remove(\"inactive\")\r\n    return state\r\n}\r\n\r\nconst showNicolButton = state => {\r\n    const button = document.querySelector(\"#low-navigation\")\r\n    button.classList.remove(\"inactive\");\r\n    return state\r\n}\r\n\n\n//# sourceURL=webpack:///./src/viewer_handlers.js?");

/***/ }),

/***/ "./src/wheelEventHandler.js":
/*!**********************************!*\
  !*** ./src/wheelEventHandler.js ***!
  \**********************************/
/*! exports provided: wheelHandler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"wheelHandler\", function() { return wheelHandler; });\n/* harmony import */ var _wheelImage_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wheelImage.js */ \"./src/wheelImage.js\");\n\r\n\r\nconst wheelHandler = state => e => {\r\n    e.preventDefault();\r\n    requestAnimationFrame(\r\n        Object(_wheelImage_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(state, e)\r\n    )\r\n}\r\n\n\n//# sourceURL=webpack:///./src/wheelEventHandler.js?");

/***/ }),

/***/ "./src/wheelImage.js":
/*!***************************!*\
  !*** ./src/wheelImage.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return wheelImage; });\n/* harmony import */ var _updateMagnify_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./updateMagnify.js */ \"./src/updateMagnify.js\");\n/* harmony import */ var _draw_state_updators_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./draw_state_updators.js */ \"./src/draw_state_updators.js\");\n\r\n\r\n\r\nfunction wheelImage(state, e) {\r\n    return () => {\r\n        Object(_updateMagnify_js__WEBPACK_IMPORTED_MODULE_0__[\"updateMagnifyByWheel\"])(state, e)\r\n        Object(_draw_state_updators_js__WEBPACK_IMPORTED_MODULE_1__[\"blobToCanvas\"])(state)\r\n        Object(_draw_state_updators_js__WEBPACK_IMPORTED_MODULE_1__[\"drawHairLine\"])(state)\r\n        Object(_draw_state_updators_js__WEBPACK_IMPORTED_MODULE_1__[\"drawScale\"])(state)\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/wheelImage.js?");

/***/ }),

/***/ "./src/windowResizeHandler.js":
/*!************************************!*\
  !*** ./src/windowResizeHandler.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return windowResizeHandler; });\n/* harmony import */ var _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./viewer_canvas.js */ \"./src/viewer_canvas.js\");\n/* harmony import */ var _getMinimumWindowSize_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getMinimumWindowSize.js */ \"./src/getMinimumWindowSize.js\");\n\r\n\r\n\r\nfunction windowResizeHandler(state) {\r\n    return new Promise((res, rej) => {\r\n        state.canvasWidth = Object(_getMinimumWindowSize_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])() - 20\r\n        state.canvasHeight = Object(_getMinimumWindowSize_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])() - 20\r\n\r\n        _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_0__[\"viewer\"].width = state.canvasWidth\r\n        _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_0__[\"viewer\"].height = state.canvasHeight\r\n        _viewer_canvas_js__WEBPACK_IMPORTED_MODULE_0__[\"viewer_ctx\"].translate(state.canvasWidth * 0.5, state.canvasHeight * 0.5)\r\n        res(state)\r\n    })\r\n}\r\n\n\n//# sourceURL=webpack:///./src/windowResizeHandler.js?");

/***/ })

/******/ });