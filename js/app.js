/**
 *  Language code of sample list is such as "ja" or "en".
 */

class StaticManager {
    constructor(
        sampleListURL,
        imageDataPathPrefix,
        dbName,
        storageName
    ) {
        this.sampleListURL = sampleListURL
        this.imageDataRoot = imageDataPathPrefix
        this.indexedDBName = dbName
        this.storageName = storageName
    }

    getSampleListURL() {
        return this.sampleListURL
    }

    getImageDataPath(packageName) {
        return this.imageDataRoot + packageName + "/"
    }

    getDBName() {
        return this.indexedDBName;
    }

    getStorageName() {
        return this.storageName
    }
}

staticSettings = new StaticManager(
    "./dynamic/rock_list.json",
    "./data-packages/",
    "db_v3",
    "files"
)

var deleteReq = indexedDB.deleteDatabase("db_v2");
var deleteReq = indexedDB.deleteDatabase("zipfiles");

class DatabaseHandler {
    constructor(db_name, version, storeName, primaryKeyName) {
        this.db = window.indexedDB;
        this.db_name = db_name;
        this.db_version = version;
        this.storeName = storeName;
        this.primaryKey = primaryKeyName;
    }

    schemeDef(db) {
        db.createObjectStore(this.storeName, { keyPath: this.primaryKey, autoIncrement: true });
    }

    connect() {
        const dbp = new Promise((resolve, reject) => {
            const req = this.db.open(this.db_name, this.db_version);
            req.onsuccess = ev => resolve(ev.target.result);
            req.onerror = ev => reject('fails to open db');
            req.onupgradeneeded = ev => this.schemeDef(ev.target.result);
        });
        dbp.then(d => d.onerror = ev => alert("error: " + ev.target.errorCode));
        return dbp;
    }

    async put(db, obj) { // returns obj in IDB
        return new Promise((resolve, reject) => {
            const docs = db.transaction([this.storeName], 'readwrite').objectStore(this.storeName);
            const req = docs.put(obj);
            req.onsuccess = () => resolve(Object.assign({ [this.primaryKey]: req.result }, obj));
            req.onerror = reject;
        });
    }

    async get(db, id) { // NOTE: if not found, resolves with undefined.
        return new Promise((resolve, reject) => {
            const docs = db.transaction([this.storeName,]).objectStore(this.storeName);
            const req = docs.get(id);
            req.onsuccess = () => resolve(req.result);
            req.onerror = reject;
        });
    }

    async delete(db, id) {
        return new Promise((resolve, reject) => {
            const docs = db.transaction([this.storeName,], 'readwrite')
                .objectStore(this.storeName);
            const req = docs.delete(id);
            req.onsuccess = () => resolve(id);
            req.onerror = reject;
        })
    }

    async loadAll(db) {
        return new Promise(async (resolve, reject) => {
            const saves = [];
            const req = db.transaction([this.storeName]).objectStore(this.storeName).openCursor();
            resolve(req)
        });
    }

    async getAllKeys(db) {
        return new Promise(async (resolve, reject) => {
            try {
                var req = db.transaction([this.storeName]).objectStore(this.storeName)
            } catch (e) {
                return resolve([])
            }

            if (req.getAllKeys) {
                req.getAllKeys().onsuccess = function (event) {
                    const rows = event.target.result;
                    resolve(rows);
                }
            } else {
                const entries = await this.loadAll(db)
                resolve(Object.keys(entries))
            }
            req.onerror = reject
        })
    }
}

class MessageBarActivitySwitcher {
    constructor(messageBarSelector) {
        this.root = document.querySelector(messageBarSelector)
        this.hook = {}
        return this
    }

    activate() {
        this.hook["activate"](this.root)
        this.root.classList.remove("inactive")
    }

    inactivate() {
        this.hook["inactivate"](this.root)
        this.root.classList.add("inactive")
    }

    setHookOnActivate(hook = rootNode => { }) {
        this.hook["activate"] = hook
        return this
    }

    setHookOnInactivate(hook = rootNode => { }) {
        this.hook["inactivate"] = hook
        return this
    }
}

const switchLoadingMessage = new MessageBarActivitySwitcher(
    "#loading_message_bar"
).setHookOnActivate(
    rootNode => {
        rootNode.querySelector(".message_space").innerHTML = "Loading images..."
        rootNode.classList.add("message-loading")
    }
).setHookOnInactivate(
    rootNode => {
        rootNode.classList.remove("message-loading")
    }
)

const switchErrorMessage = new MessageBarActivitySwitcher(
    "#error_message_bar"
).setHookOnInactivate(
    rootNode => {
        rootNode.classList.remove("message-error")
    }
)


const showLoadingMessage = state => {
    switchLoadingMessage.activate()
    return state
}

const hideLoadingMessage = state => {
    switchLoadingMessage.inactivate()
    return state
}

const hideWelcomeBoard = state => {
    const board = document.querySelector("#welcome-card")
    board.classList.add("inactive");
    return state
}

const showViewer = state => {
    const card = document.querySelector("#viewer_wrapper")
    card.classList.remove("inactive")
    return state
}

const showNicolButton = state => {
    const button = document.querySelector("#low-navigation")
    button.classList.remove("inactive");
    return state
}

function hideErrorMessage(state) {
    switchErrorMessage.inactivate()
    return state
}

function showErrorMessage(message) {
    return (_) => {
        switchErrorMessage.setHookOnActivate(
            rootDOM => {
                rootDOM.querySelector(".message_space").innerHTML = message
                rootDOM.classList.add("message-error")
            }
        )
        switchErrorMessage.activate()
        return _
    }
}

class DummyDatabaseHandler extends DatabaseHandler {
    constructor(db_name, version, storeName, primaryKeyName) {
        console.warn("IndexedDB is not available !")
        super(db_name, version, storeName, primaryKeyName)
        this.storage = {}
    }

    connect() {
        return {}
    }

    put(db, obj) {
        if (db.hasOwnProperty(obj[this.primaryKey])) {
            var old = db[obj[this.primaryKey]]
        } else {
            var old = {}
        }
        const new_entry = Object.assign(old, obj)
        db[obj[this.primaryKey]] = new_entry;
        return { [obj[this.primaryKey]]: new_entry }
    }

    get(db, id) {
        if (db.hasOwnProperty(id)) {
            return db[id]
        } else {
            return undefined
        }
    }

    delete(db, id) {
        if (db.hasOwnProperty(id)) {
            db[id] = null;
            return id
        } else {
            return undefined
        }
    }

    loadAll(db) {
        return Object.entries(db)
    }

    getAllKeys(db) {
        return Object.keys(db)
    }
}

class NativeLocalStorage {
    constructor() {
        this.db = window.localStorage
    }

    put(key, value) {
        this.db.setItem(key, value);
    }

    get(key) {
        const value = this.db.getItem(key)
        return (value == null)
            ? undefined
            : value
    }
}

class DummyLocalStorage {
    constructor() {
        this.db = {}
    }

    put(key, value) {
        this.db[key] = value;
    }

    get(key) {
        return (this.db.hasOwnProperty("key"))
            ? this.db[key]
            : undefined
    }
}

async function detectWebpSupport() {

    const testImageSources = [
        "data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==",
        "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA="
    ]

    const testImage = (src) => {
        return new Promise((resolve, reject) => {
            var img = document.createElement("img")
            img.onerror = error => resolve(false)
            img.onload = () => resolve(true)
            img.src = src
        })
    }

    const results = await Promise.all(testImageSources.map(testImage))

    return results.every(result => !!result)
}

const relax = () => new Promise(resolve => requestAnimationFrame(resolve))


async function detectJ2kSupport() {
    const testImageSources = [
        'data:image/jp2;base64,AAAADGpQICANCocKAAAAFGZ0eXBqcDIgAAAAAGpwMiAAAAAtanAyaAAAABZpaGRyAAAABAAAAAQAAw8HAAAAAAAPY29scgEAAAAAABAAAABpanAyY/9P/1EALwAAAAAABAAAAAQAAAAAAAAAAAAAAAQAAAAEAAAAAAAAAAAAAw8BAQ8BAQ8BAf9SAAwAAAABAQAEBAAB/1wABECA/5AACgAAAAAAGAAB/5PP/BAQFABcr4CA/9k='
    ]

    const testImage = (src) => {
        return new Promise((resolve, reject) => {
            var img = document.createElement("img")
            img.onerror = error => resolve(false)
            img.onload = () => resolve(true)
            img.src = src
        })
    }

    const results = await Promise.all(testImageSources.map(testImage))

    return results.every(result => !!result)
}

async function getSupportedImageType() {
    if (await detectWebpSupport()) {
        return "webp"
    }
    if (await detectJ2kSupport()) {
        return "jp2"
    }
    return "jpg"
}



function ISmallStorageFactory() {
    return (window.localStorage)
        ? new NativeLocalStorage()
        : new DummyLocalStorage()
}

function es6Available() {
    return (typeof Symbol === "function" && typeof Symbol() === "symbol")
}


function selectLanguageCode() {
    const code = (window.navigator.languages && window.navigator.languages[0]) ||
        window.navigator.language ||
        window.navigator.userLanguage ||
        window.navigator.browserLanguage;

    const lang = code.match("ja") ? "ja" : "en";

    return lang
}

/**
 *
 * @param {String,Object[String,String]} multiLanguageTextObj
 * @return {String}
 */
function multiLanguage(multiLanguageTextObj, languageCode) {
    if (typeof (multiLanguageTextObj) === "string") {
        return multiLanguageTextObj
    } else if (typeof (multiLanguageTextObj) === "object") {
        if (multiLanguageTextObj.hasOwnProperty(languageCode)) {
            return multiLanguageTextObj[languageCode]
        } else {
            const keys = Object.keys(multiLanguageTextObj)
            return (keys.length > 0)
                ? multiLanguageTextObj[keys[0]]
                : ""
        }
    } else {
        return ""
    }
}

function overwrideLanguageByLocalStorage(state) {
    const langInLocalStorage = state.localStorage.get("language")
    const lang = (langInLocalStorage !== undefined)
        ? langInLocalStorage
        : state.language;
    state.language = lang
    document.querySelector("option[value=" + lang + "]").selected = true
    return state
}

const stepBy = unit => val => Math.floor(val / unit)

const cycleBy = unit => val => {
    cycle_count = Math.floor(val / unit)
    return val < 0
        ? val + unit
        : (unit <= val)
            ? val - unit * cycle_count
            : val
}

const mirrorBy = (center) => val => val > center ? 2 * center - val : val

const isInverse = degree => (180 <= degree)

const rotateSign = (clockwise = true) => clockwise ? -1 : 1

const getMinimumWindowSize = () => {
    const width = window.innerWidth
    const height = window.innerHeight - 200
    return width < height ? width : height
}

const VIEW_PADDING = 0 // px


const resetState = () => ({
    "containorID": "",
    "imageNumber": 1,
    "canvasWidth": getMinimumWindowSize() <= 500
        ? getMinimumWindowSize()
        : 500,
    "canvasHeight": getMinimumWindowSize() <= 500
        ? getMinimumWindowSize()
        : 500,
    "imageRadius": 0,
    "open_image_srcs": [],
    "open_images": [],
    "cross_image_srcs": [],
    "cross_images": [],
    "isMousedown": false,
    "drag_start": [0, 0],
    "drag_end": [0, 0],
    "rotate": 0,
    "rotate_axis_translate": [],
    "isClockwise": true,
    "isCrossNicol": false,
    "language": selectLanguageCode(),
    "storedKeys": [],
    "drawHairLine": true,
    "canRotate": true,
})


let viewer = document.querySelector("#main-viewer")
let viewer_ctx = viewer.getContext("2d")

async function connectDatabase(state) {
    state.zipDBHandler = (window.indexedDB)
        ? (!navigator.userAgent.match("Edge"))
            ? new DatabaseHandler(staticSettings.getDBName(), 2, staticSettings.getStorageName(), "id")
            : new DummyDatabaseHandler(staticSettings.getDBName(), 2, staticSettings.getStorageName(), "id")
        : new DummyDatabaseHandler(staticSettings.getDBName(), 2, staticSettings.getStorageName(), "id")
    state.zipDB = await state.zipDBHandler.connect()
    state.storedKeys = await state.zipDBHandler.getAllKeys(state.zipDB)
    return state
};

async function checkSupportImageFormat(state) {
    state.supportWebp = await detectWebpSupport();
    state.supportJ2k = await detectJ2kSupport();
    state.supportedImageType = await getSupportedImageType();
    return state
}

function connectLocalStorage(state) {
    state.localStorage = ISmallStorageFactory();
    return state
}


/**
 * サンプルリストをselectタグ内に追加する
 * @param {*} state
 */
const sampleListPresenter = state => response => new Promise(async (res, rej) => {

    const savedSampleNames = state.storedKeys;

    const sampleList = response["list_of_sample"];
    const sampleSelectDOM = document.querySelector("#rock_selector");
    sampleSelectDOM.innerHTML = "<option value='' disabled selected style='display:none;'>Select sample</option>";
    const options = sampleList.map(v => {
        const option = document.createElement("option")
        option.value = v["package-name"];
        option.innerHTML = (savedSampleNames.includes(v["package-name"]) ? "✓ " : "") + v["list-name"][state.language]
        if (savedSampleNames.includes(v["package-name"])) {
            option.classList.add("downloaded")
        }
        return option
    })
    options.forEach(v => {
        sampleSelectDOM.appendChild(v)
    })

    document.querySelector("#top-navigation").classList.add("isready");
    sampleSelectDOM.classList.add("isready")
    res(response);
})

const sampleListLoader = state => new Promise(async (res, rej) => {
    const listURL = staticSettings.getSampleListURL();
    try {
        var response = await fetch(listURL)
            .catch((e) => { throw Error(e) })
            .then(r => r.json())
        state.localStorage.put("list_of_sample", JSON.stringify(response["list_of_sample"]))
    } catch (e) {
        var stored_list = state.localStorage.get("list_of_sample")
        var response = { "list_of_sample": JSON.parse(stored_list) }
        console.warn(e)
        showErrorMessage("<p>Internet disconnected.</p>")()
    }

    sampleListPresenter(state)(response)
        .then(_ => res(state))
        .catch(rej)
})

const windowResizeHandler = state => new Promise((res, rej) => {
    state.canvasWidth = getMinimumWindowSize() - 20
    state.canvasHeight = getMinimumWindowSize() - 20

    viewer = document.querySelector("#main-viewer")
    viewer_ctx = viewer.getContext("2d")
    viewer.width = state.canvasWidth
    viewer.height = state.canvasHeight
    viewer_ctx.translate(state.canvasWidth * 0.5, state.canvasHeight * 0.5)
    res(state)
})





const updateStateByMeta = (state) => (containorID, meta) => new Promise((res, rej) => {


    state.containorID = sanitizeID(containorID);
    state.isClockwise = meta.rotate_clockwise
    state.location = (meta.hasOwnProperty("location"))
        ? meta.location
        : "Unknown"
    state.rockType = (meta.hasOwnProperty("rock_type"))
        ? meta.rock_type
        : "Unknown"
    state.owner = (meta.hasOwnProperty("owner"))
        ? meta.owner
        : "Unknown"
    state.discription = (meta.hasOwnProperty("discription"))
        ? meta.discription
        : "No discription. "
    state.rotate_center = getRotationCenter(meta)

    state.imageWidth = meta.image_width;
    state.imageHeight = meta.image_height;

    function getRotationCenter(meta) {
        return (meta.hasOwnProperty("rotate_center"))
            ? {
                "to_right": meta.rotate_center[0],
                "to_bottom": meta.rotate_center[1]
            }
            : {
                "to_right": meta.image_width * 0.5,
                "to_bottom": meta.image_height * 0.5
            }
    }

    function getImageRadius(meta) {
        const shift = getRotationCenter(meta);
        const image_center = {
            "x": meta.image_width * 0.5,
            "y": meta.image_height * 0.5
        }
        return Math.min(
            image_center.x - Math.abs(image_center.x - shift.to_right),
            image_center.y - Math.abs(image_center.y - shift.to_bottom)
        )
    }

    state.imageRadius = getImageRadius(meta)
    state.imageRadiusOriginal = getImageRadius(meta)
    state.scaleWidth = (meta.hasOwnProperty("scale-pixel"))
        ? parseInt(meta["scale-pixel"])
        : false
    state.scaleText = (meta.hasOwnProperty("scale-unit"))
        ? meta["scale-unit"]
        : false


    const rotate_degree_step = meta.rotate_by_degree
    const cycle_degree = meta.hasOwnProperty("cycle_rotate_degree")
        ? parseInt(meta.cycle_rotate_degree)
        : 90;
    const image_number = cycle_degree / rotate_degree_step + 1
    state.image_number = image_number
    const mirror_at = (image_number - 1)
    const total_step = (image_number - 1) * 2

    state.getImageNumber = cycle_degree > 0
        ? degree => cycleBy(image_number - 1)(
            stepBy(rotate_degree_step)(state.isClockwise ? 360 - degree : degree)
        )
        : degree => mirrorBy(mirror_at)(
            cycleBy(total_step)(
                stepBy(rotate_degree_step)(degree)
            )
        )

    state.getAlpha = degree => {
        nth = cycleBy(total_step * 2)(
            stepBy(rotate_degree_step)(degree)
        )
        return 1 - (degree - rotate_degree_step * nth) / rotate_degree_step
    }

    state.open_images = []
    state.cross_images = []

    state.rotate = 0;

    res(state)
})


function selectImageInContainor(containor, prefix) {
    if (prefix in containor) {
        return containor[prefix]
    }
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII="
}

function handleImgSrc(src) {
    if (src instanceof Blob) {
        const url = window.URL || window.webkitURL;
        return url.createObjectURL(src)
    } else if (src instanceof String) {
        return src
    } else {
        return src
    }
}

/**
 * @parameter src {dataURL}
 */
function loadImageSrc(src) {
    return new Promise((res, rej) => {

        const img = new Image()

        img.onload = _ => {
            this.onnerror = null;
            res(img)
        }
        img.onerror = e => {
            res(img)
        }

        img.src = handleImgSrc(src)
    })
}


const setOpenAndCrossImages = state => imgSets => new Promise((res, rej) => {
    state.open_images = imgSets.open
    state.cross_images = imgSets.cross
    res(state)
})

function updateImageSrc(imagesMap, type) {
    return (state) => new Promise(async (res, rej) => {

        Promise.all([
            Promise.all(Array(state.image_number - 1).fill(0)
                .map((_, i) => selectImageInContainor(imagesMap, `o${i + 1}.${type}`))
                .map(loadImageSrc)
            ),
            Promise.all(Array(state.image_number - 1).fill(0)
                .map((_, i) => selectImageInContainor(imagesMap, `c${i + 1}.${type}`))
                .map(loadImageSrc)
            )
        ]).then(imgDOMs => {
            const open_imgs = imgDOMs[0]

            const cross_imgs = imgDOMs[1]

            return { open: open_imgs, cross: cross_imgs }
        })
            .then(setOpenAndCrossImages(state))
            .then(res)
    })
}

if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function (callback, type, quality) {

            var binStr = atob(this.toDataURL(type, quality).split(',')[1]),
                len = binStr.length,
                arr = new Uint8Array(len);

            for (var i = 0; i < len; i++) {
                arr[i] = binStr.charCodeAt(i);
            }

            callback(new Blob([arr], { type: type || 'image/png' }));
        }
    });
}


function handleErrors(response) {
    if (response.ok) {
        return response;
    }

    switch (response.status) {
        case 400: throw new Error('INVALID_TOKEN');
        case 401: throw new Error('UNAUTHORIZED');
        case 500: throw new Error('INTERNAL_SERVER_ERROR');
        case 502: throw new Error('BAD_GATEWAY');
        case 404: throw new Error('NOT_FOUND');
        default: throw new Error('UNHANDLED_ERROR');
    }
}



const updateViewDiscription = state => {
    const discriptionBox = document.querySelector("#view_discription")
    const lang = state.language

    const rockFrom = `${multiLanguage(state.rockType, lang)} ${state.location ? "(" + multiLanguage(state.location, lang) + ")" : ""}`
    const rockDisc = multiLanguage(state.discription, lang)
    const rockOwner = multiLanguage(state.owner, lang)

    const textTemplate = `<ul style="list-style-type:none;">
            <li>${rockFrom}</li>
            <li>${rockDisc}</li>
            <li>${rockOwner}</li>
        </ul>`

    discriptionBox.innerHTML = textTemplate;
    return state
}







/**
 *
 * @param {*} state
 * @param {*} key
 * @return {Object[meta,zip]}
 */
function registerZip(state) {
    return async (entry) => {

        const newOne = await state.zipDBHandler.put(state.zipDB, entry)

        state.storedKeys.push(entry.id)

        if (state.storedKeys.length > 20) {
            const oldest = state.storedKeys.shift()
            const deleted = await state.zipDBHandler.delete(state.zipDB, oldest)
            Array.from(document.querySelectorAll(`#rock_selector>option[value=${oldest}]`)).forEach(option => {
                label = option.innerHTML.replace("✓ ", "")
                option.innerHTML = label
                option.classList.remove("downloaded")
            })
        }

        return state
    }
}

function register(state, isNewData) {
    if (isNewData) {
        return entry => new Promise((res, rej) => {
            registerZip(state)(entry)
                .then(res)
        })
    } else {
        return _ => new Promise((res, rej) => {
            res(state)
        })
    }
}

/**
 *
 * @param {*} packageName
 * @return {Object[meta,zip]}
 */
const markDownloadedOption = packageName => manifest => _ => new Promise((res, rej) => {
    Array.from(document.querySelectorAll(`#rock_selector>option[value=${packageName}]`)).forEach(option => {
        label = option.innerHTML.replace("✓ ", "")
        option.innerHTML = "✓ " + label
        option.classList.add("downloaded")
    })
    res(_)
})


/**
 *
 * @param {String} url
 * @return {Array[String, Boolean]} [lastModified, networkDisconnected]
 */
async function queryLastModified(url) {
    try {
        const header = await fetch(url, { method: 'HEAD' }).catch(e => {
            console.log("Package metadata cannot be fetched.")
            throw Error(e)
        })
        var lastModified = header.headers.get("last-modified")
        var networkDisconnected = false
        return [lastModified, networkDisconnected]
    } catch (e) {
        var lastModified = "none"
        var networkDisconnected = true
        return [lastModified, networkDisconnected]
    }
}


function progressCircle(selector) {
    const progress_circle = document.querySelector(selector)
    const total = progress_circle.attributes["r"].value * 2 * Math.PI
    progress_circle.attributes["stroke-dasharray"].value = total
    progress_circle.attributes["stroke-dashoffset"].value = total

    return (load) => {
        progress_circle.attributes["stroke-dashoffset"].value = total * (1 - 0.5 * load)
    }
}

function progressBar(selector) {
    const progress = document.querySelector(selector)
    const bar = progress.querySelector(".bar")
    bar.style.width = "0%"
    const total = progress.clientWidth
    return e => {
        bar.style.width = `${(e.loaded / e.total) * 100}%`
    }
}

function completeLoading(selector) {
    const progress = document.querySelector(selector)
    const bar = progress.querySelector(".bar")
    return e => {
        bar.style.width = "0%"
    }
}

function unzipper(url) {
    return new Promise((res, rej) => {

        Zip.inflate_file(url, res, rej, progressBar("#progress_bar"), completeLoading("#progress_bar"))
    })
}

function imagePackageFetcher(packageUrl) {
    return async () => await unzipper(packageUrl)
        .then(extractFile)
}

function fetchImagePackage(fetcher, response, toBeFetch) {
    return async state => {
        if (!toBeFetch) return [state, response];

        const new_response = Object.assign(
            response,
            { zip: await fetcher() }
        )
        return [state, new_response]
    }
}

function convertBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader;
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });
}

/**
 * 指定したkeyのデータがDBの中にある場合, DBからデータを取得する.
 * サーバとDBでデータの最終更新時刻が一致すれば,
 *  DBのデータを返す.
 * ネットワークエラーの場合, DBのデータか無を返す
 *
 * そうでなければサーバからmanifestとsumbnailを取得して返す.
 * また, 画像本体のzipファイルをfetchするアクションを起こす関数を返す.
 *
 * @param {Object} state
 * @param {String} packageName
 * @param {String} lastModified_remote
 * @param {Boolean} networkDisconnected
 * @return {Array[Object,Boolean, function]} [response, toBeStored, zipLoader]
 */
async function queryImagePackage(state, packageName, lastModified_remote, networkDisconnected) {
    const key = sanitizeID(packageName)
    const storedData = await state.zipDBHandler.get(state.zipDB, key)

    if (storedData !== undefined && storedData.lastModified === lastModified_remote) {
        var toBeStored = false
        return [storedData, toBeStored, null]
    }
    if (networkDisconnected) {
        if (storedData !== undefined) {
            var toBeStored = false
            return [storedData, toBeStored, null]
        } else {
            return [null, false, null]
        }
    } else {
        const manifestUrl = staticSettings.getImageDataPath(packageName) + "manifest.json";
        const open_thumbnailUrl = staticSettings.getImageDataPath(packageName) + "o1.jpg";
        const cross_thumbnailUrl = staticSettings.getImageDataPath(packageName) + "c1.jpg";
        const zipUrl = staticSettings.getImageDataPath(packageName) + state.supportedImageType + ".zip"
        const response = {
            manifest: await fetch(manifestUrl)
                .then(response => response.text()),
            thumbnail: {
                "o1.jpg": await fetch(open_thumbnailUrl)
                    .then(response => response.blob())
                    .then(convertBlobToBase64),
                "c1.jpg": await fetch(cross_thumbnailUrl)
                    .then(response => response.blob())
                    .then(convertBlobToBase64)
            },
            id: key,
            lastModified: lastModified_remote,
            zip: null,
        }
        var toBeStored = true
        const zipLoader = imagePackageFetcher(zipUrl)
        return [response, toBeStored, zipLoader]
    }
}




/**
 * パッケージのメタデータを取得する.
 * @param {*} state
 * @param {String} packageName
 */
const getPackageMetaData = (state, packageName) => new Promise(async (res, rej) => {


    const imageType = state.supportedImageType

    const packageUrl = staticSettings.getImageDataPath(packageName) + imageType + ".zip"
    const [lastModified, networkDisconnected] = await queryLastModified(packageUrl)

    const packageMetaData = await queryImagePackage(state, packageName, lastModified, networkDisconnected)

    res(packageMetaData)
})

function bufferToBase64(buffer, ext) {
    return new Promise((res, rej) => {

        var bytes = new Uint8Array(buffer);
        var binary = '';
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        res(`data:image/${ext};base64,` + window.btoa(binary));
    })
}

/**
 *
 * @param {*} zip
 * @return {Object[meta,zip]}
 */
async function extractFile(zipByte) {
    const zip = Zip.inflate(zipByte)
    const inflated_zip = {}
    await Promise.all(Object.entries(zip.files).map(async kv => {
        if (kv[0].includes(".json")) {
            inflated_zip[kv[0]] = kv[1].inflate()
        } else {
            const type = kv[0].match(/.*\.(\w+)$/)[1]
            const base64 = await bufferToBase64(kv[1].inflate(), type)
            const mime = base64.match(/^data:(image\/\w+);/)[1]
            const mime_type = mime.split("/")[1]

            const new_file_name = kv[0].split(".")[0] + "." + mime_type

            inflated_zip[new_file_name] = base64

        }

        return true
    }))

    return inflated_zip
}



const rockNameSelectHandler = state => {
    return new Promise(async (res, rej) => {
        const rock_selector = document.querySelector("#rock_selector")
        const packageName = rock_selector.options[rock_selector.selectedIndex].value

        state.canRotate = false;
        hideErrorMessage()
        showLoadingMessage()
        hideWelcomeBoard()
        showViewer()
        showNicolButton()

        /**
         * fetch lastmodified
         * fetch manifest
         * fetch sumbnail
         *
         * show sumbnail
         * show discription
         *
         * load images
         *  from db
         *  fetch
         *
         * store data
         */

        try {
            const [response, isNewData, zipLoader] = await getPackageMetaData(state, packageName);
            const manifest = JSON.parse(response.manifest);

            const [new_state, new_response] = await updateStateByMeta(state)(packageName, manifest)
                .then(updateViewDiscription)
                .then(updateImageSrc(response.thumbnail, "jpg"))
                .then(updateView)
                .then(fetchImagePackage(zipLoader, response, isNewData))

            new_state.canRotate = true

            updateImageSrc(new_response.zip, new_state.supportedImageType)(new_state)
                .then(state => register(state, isNewData)(new_response)
                )
                .then(markDownloadedOption(packageName)(manifest))
                .then(updateView)
                .then(res)
        } catch (e) {
            rej(e)
        }
    })
}

function sanitizeID(id) {
    return id.replace(/\//g, "_").replace(/\./g, "")
}





/**
 * Check images are in containor.
 * If true, set them in state object.
 * else, create img element and set them in state object.
 */
const createImageContainor = state => new Promise((res, rej) => {

    Promise.all([
        Promise.all(state.open_image_srcs.map(src => loadImageSrc(src))),
        Promise.all(state.cross_image_srcs.map(src => loadImageSrc(src)))
    ])
        .then(imgDOMs => {
            const open_imgs = imgDOMs[0]

            const cross_imgs = imgDOMs[1]

            return { open: open_imgs, cross: cross_imgs }
        })
        .then(setOpenAndCrossImages(state))
        .then(res)

})

/**
 *  range of state.rotate is 0 <= degree < 360
 */

const clipGeometoryFromImageCenter = (imgDOM, state) => {

    return [
        state.rotate_center.to_right - state.imageRadius,
        state.rotate_center.to_bottom - state.imageRadius,
        state.imageRadius * 2,
        state.imageRadius * 2
    ]
}

function clearView(state) {
    viewer_ctx.clearRect(-state.canvasWidth * 0.5, -state.canvasHeight * 0.5, state.canvasWidth, state.canvasHeight)
    return state
}

function blobToCanvas(state) {

    image_srcs = state.isCrossNicol
        ? state.cross_images
        : state.open_images

    // view window circle

    viewer_ctx.save()
    viewer_ctx.beginPath()
    viewer_ctx.arc(0, 0, state.canvasWidth / 2 - VIEW_PADDING, 0, Math.PI * 2, false)
    viewer_ctx.clip()

    // Draw a image
    alpha = state.getAlpha(state.rotate)

    viewer_ctx.rotate(
        rotateSign(state.isClockwise) * (state.rotate + state.getImageNumber(state.rotate) * 15) / 180 * Math.PI
    )

    viewer_ctx.globalAlpha = 1
    image1 = image_srcs[state.getImageNumber(state.rotate)]

    try {
        viewer_ctx.drawImage(
            image1,
            ...clipGeometoryFromImageCenter(image1, state),
            -state.canvasWidth / 2,
            -state.canvasHeight / 2,
            state.canvasWidth,
            state.canvasHeight
        );
    } catch (e) {

    }

    viewer_ctx.restore()

    // Draw next image
    viewer_ctx.save()
    viewer_ctx.beginPath()
    viewer_ctx.arc(0, 0, state.canvasWidth / 2 - VIEW_PADDING, 0, Math.PI * 2, false)
    viewer_ctx.clip()

    viewer_ctx.rotate(
        rotateSign(state.isClockwise) * (state.rotate + state.getImageNumber(state.rotate + 15) * 15) / 180 * Math.PI
    )

    viewer_ctx.globalAlpha = 1 - alpha
    image2 = image_srcs[state.getImageNumber(state.rotate + 15)]
    try {
        viewer_ctx.drawImage(
            image2,
            ...clipGeometoryFromImageCenter(image2, state),
            -state.canvasWidth / 2,
            -state.canvasHeight / 2,
            state.canvasWidth,
            state.canvasHeight)
    } catch (e) {

    }
    viewer_ctx.restore()
    return state
}

function drawHairLine(state) {
    if (!state.drawHairLine) return
    viewer_ctx.strokeStyle = state.isCrossNicol
        ? "white"
        : "black";
    viewer_ctx.globalAlpha = 1
    viewer_ctx.beginPath()
    viewer_ctx.moveTo(0, -state.canvasHeight * 0.5 + VIEW_PADDING)
    viewer_ctx.lineTo(0, state.canvasHeight * 0.5 - VIEW_PADDING)
    viewer_ctx.moveTo(-state.canvasWidth * 0.5 + VIEW_PADDING, 0)
    viewer_ctx.lineTo(state.canvasWidth * 0.5 - VIEW_PADDING, 0)
    viewer_ctx.closePath()
    viewer_ctx.stroke()
    return state
}

const scaleLength = (canvasWidth, imageWidth, scaleWidth) => canvasWidth * scaleWidth / imageWidth

function drawScale(state) {
    if (!state["scaleWidth"]) return;
    let scalePixel = scaleLength(state.canvasWidth, state.imageRadius * 2, state.scaleWidth)
    const canvasWidth = state.canvasWidth;
    const scaleBar = document.querySelector("#scalebar")


    let scaleNumber = state.scaleText.match(/(\d+\.?\d*)/)[0] * 1
    const scaleUnit = state.scaleText.match(/\D*$/)[0]

    while (scalePixel >= canvasWidth) {
        scalePixel *= 0.5
        scaleNumber *= 0.5
    }
    scaleBar.style.width = scalePixel + "px";
    scaleBar.querySelector("div:first-child").innerHTML = `${scaleNumber} ${scaleUnit}`;
    return state
}

const updateState = (state, newState) => new Promise((res, rej) => {
    _state = Object.assign(state, newState)
    console.log(_state)
    res(_state)
})


function updateView(state) {
    clearView(state)
    blobToCanvas(state)
    drawHairLine(state)
    drawScale(state)
    return state
}


const getCoordinateOnCanvas = canvas => (e, fingur = 0) => {
    if (e instanceof MouseEvent) {
        return (e instanceof WheelEvent)
            ? [
                e.deltaX,
                e.deltaY
            ]
            : [
                e.pageX - canvas.offsetLeft,
                e.pageY - canvas.offsetTop
            ]
    } else if (e instanceof TouchEvent && e.touches.length > fingur) {
        return [
            e.touches[fingur].pageX - canvas.offsetLeft,
            e.touches[fingur].pageY - canvas.offsetTop
        ]
    }
}

const canvasCoordinate = getCoordinateOnCanvas(viewer)



const radiunBetween = (cx, cy) => (_x1, _y1, _x2, _y2) => {
    x1 = _x1 - cx
    x2 = _x2 - cx
    y1 = _y1 - cy
    y2 = _y2 - cy

    cos = (x1 * x2 + y1 * y2) / Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2))
    return Math.sign(x1 * y2 - x2 * y1) * Math.acos(cos)
}

/**
 * Update start and end position
 * @param {*} state
 * @param {*} e
 */
function updateCoordinate(state, e) {
    state.drag_start = state.drag_end || undefined
    state.drag_end = canvasCoordinate(e)

    state.pinch_start = state.pinch_end || undefined
    state.pinch_end = canvasCoordinate(e, 1)
    return state
}

/**
 * Calculate small difference of rotation.
 * Update total rotation.
 *
 * @param {*} state
 * @param {*} e
 */
function updateRotate(state, e) {
    if (!state.canRotate) return;
    if (state.drag_start === undefined) return
    // delta rotate radius
    const rotate_end = radiunBetween(
        state.canvasWidth * 0.5,
        state.canvasHeight * 0.5
    )(...state.drag_end, ...state.drag_start)

    state.rotate += rotate_end / Math.PI * 180
    if (state.rotate >= 360) {
        state.rotate -= 360
    } else if (state.rotate < 0) {
        state.rotate += 360
    }
    return state
}



const rotateImage = (state, e) => () => {
    updateCoordinate(state, e)
    updateRotate(state, e)
    blobToCanvas(state)
    drawHairLine(state)
}

function updateMagnifyByPinch(state, e) {
    if (state.drag_start === undefined) return
    if (state.pinch_start === undefined) return

    const x1 = [...state.drag_start]
    const y1 = [...state.pinch_start]
    const x2 = [...state.drag_end]
    const y2 = [...state.pinch_end]

    const expansion = Math.sqrt((x2[0] - y2[0]) ** 2 + (x2[1] - y2[1]) ** 2) / Math.sqrt((x1[0] - y1[0]) ** 2 + (x1[1] - y1[1]) ** 2)

    const newRadius = (expansion > 2)
        ? state.imageRadius
        : state.imageRadius / expansion
    state.imageRadius = (newRadius) > state.imageRadiusOriginal
        ? state.imageRadiusOriginal
        : (newRadius < 100)
            ? 100
            : newRadius
    return state
}

function updateMagnifyByWheel(state, e) {
    const scrolled = canvasCoordinate(e)[1]

    const newRadius = state.imageRadius + scrolled
    state.imageRadius = (newRadius) > state.imageRadiusOriginal
        ? state.imageRadiusOriginal
        : (newRadius < 100)
            ? 100
            : newRadius
    return state
}

const pinchImage = (state, e) => () => {
    updateCoordinate(state, e)
    updateMagnifyByPinch(state, e)
    blobToCanvas(state)
    drawHairLine(state)
    drawScale(state)
}

const touchStartHandler = state => e => {
    state.isMousedown = true
    state.drag_end = canvasCoordinate(e)
    e.preventDefault();
}

const wheelImage = (state, e) => () => {
    updateMagnifyByWheel(state, e)
    blobToCanvas(state)
    drawHairLine(state)
    drawScale(state)
}

const wheelHandler = state => e => {
    e.preventDefault();
    requestAnimationFrame(
        wheelImage(state, e)
    )
}

const touchMoveHandler = state => e => {
    if (!state.isMousedown) return
    if (e instanceof MouseEvent || e.touches.length === 1) {
        e.preventDefault();
        requestAnimationFrame(
            rotateImage(state, e)
        )
    } else if (e.touches.length === 2) {
        e.preventDefault()
        requestAnimationFrame(
            pinchImage(state, e)
        )
    }
    //if (e.cancelable) {

    //}
}

const touchEndHandler = state => e => {
    state.isMousedown = false
    state.drag_end = undefined
    state.pinch_end = undefined
    e.preventDefault()
}





function languageChangeHundler(state) {
    return function (e) {
        return new Promise((res, rej) => {
            const languageSelector = document.querySelector("#language_selector")
            const lang = languageSelector.options[languageSelector.selectedIndex].value;
            state.language = lang
            state.localStorage.put("language", lang)
            res(state)
        })
    }
}


function contact_handler() {
    return async function (e, messageDOM) {
        const button = e.target
        button.classList.add("pending")

        messageDOM.classList.add("inactive")
        messageDOM.classList.remove("success")
        messageDOM.classList.remove("error")

        const form = document.querySelector("#form-contact")
        const selection = form.querySelector("#select-contact_topic")
        const topic = selection[selection.selectedIndex].value
        const message = form.querySelector("textarea").value
        const from = form.querySelector("input[type=email").value

        if (topic === "") {
            button.classList.remove("pending")
            messageDOM.innerHTML = "Select topic !"
            messageDOM.classList.add("error")
            messageDOM.classList.remove("inactive")
            return false
        }

        if (message === undefined || message == "") {
            button.classList.remove("pending")
            messageDOM.innerHTML = "Write message !"
            messageDOM.classList.add("error")
            messageDOM.classList.remove("inactive")
            return false
        }

        const obj = {
            "from": from,
            "title": topic,
            "body": message
        }

        const method = "POST";
        const body = JSON.stringify(obj);
        const headers = {
            'Accept': 'text/plain,application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',

        };

        console.log({ method, headers, body })

        try {
            const response = await fetch("https://dgo96yhuni.execute-api.us-east-1.amazonaws.com/contactapi/contact", { method, headers, body, 'mode': 'no-cors' })
            messageDOM.innerHTML = "Success. Thank you for contributing !"
            messageDOM.classList.add("success")
            messageDOM.classList.remove("inactive")
        } catch (e) {
            console.log(e)
            messageDOM.innerHTML = "Network error !"
            messageDOM.classList.add("error")
            messageDOM.classList.remove("inactive")
        }
        button.classList.remove("pending")

        return false
    }
}
