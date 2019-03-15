/**
 *  Language code of sample list is such as "ja" or "en".
 */

class StaticManager {
    constructor(
        sampleListURL,
        imageDataPathPrefix
    ) {
        this.sampleListURL = sampleListURL
        this.imageDataPathPrefix = imageDataPathPrefix
    }

    getSampleListURL() {
        return this.sampleListURL
    }

    getImageDataPath(packageName) {
        return this.imageDataPathPrefix + packageName + ".zip"
    }
}

staticSettings = new StaticManager(
    "./dynamic/rock_list.json",
    "./zipped/",
)



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

            const req = db.transaction([this.storeName]).objectStore(this.storeName)

            if (req.getAllKeys) {
                req.getAllKeys().onsuccess = function (event) {
                    const rows = event.target.result;
                    resolve(rows);
                }
            } else {
                const entries = await this.loadAll(db)
                resolve(Object.keys(entries))
            }
            registerZip.onerror = reject
        })
    }
}

class TextNode {
    constructor(selector) {
        this.dom = document.querySelector(selector)
    }

    message(str) {
        this.dom.innerHTML = str;
    }
}

const loadingMessage = new TextNode("#loading_message")

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


class ImageDecoder {
    constructor() {
        this.webp = new Webp()
        this.supportWebp = detectWebpSupport;
        const canvas = document.createElement("canvas")
        this.canvas = canvas
    }

    /** decode
     *
     * @param {Uint8Array} u8array
     * @param {String} type
     * @return {Promise<string>}
     */
    async decode(u8array, type = "webp") {

        //if (this.busy) throw new Error("webp-machine decode error: busy")
        this.busy = true

        if (await this.supportWebp() || type !== "webp") {
            var binary = '';
            var len = u8array.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(u8array[i]);
            }
            return `data:image/${type};base64,` + window.btoa(binary);
        }

        try {
            await relax()
            this.webp.setCanvas(this.canvas)
            this.webp.webpToSdl(u8array, u8array.length)
            this.busy = false
            return this.canvas.toDataURL("image/jpeg")
        }
        catch (error) {
            this.busy = false
            error.message = `webp-machine decode error: ${error.message}`
            throw error
        }
    }
}

class ImageDecoderWorker {
    constructor() {
        this.supportWebp = detectWebpSupport;
        const canvas = document.createElement("canvas")
        this.canvas = canvas
        this.ctx = this.canvas.getContext("2d");
        this.worker = new Worker("/js/decode_webp_worker.js");
        this.storage = {}
        this.cnt = 0
        this.resolves = {}
        this.rejects = {}
    }

    async decode(u8array, type = "webp") {

        if (await this.supportWebp() || type !== "webp") {
            var binary = '';
            var len = u8array.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(u8array[i]);
            }
            return `data:image/${type};base64,` + window.btoa(binary);
        }


        return new Promise((res, rej) => {
            this.resolves[this.cnt] = res


            //let sharedAb = new SharedArrayBuffer(u8array.byteLength)
            //let sharedU8 = new Uint8Array(sharedAb)
            //sharedU8.set(u8array, 0)

            this.worker.onmessage = e => {
                const id = e.data.imageData;
                const num = e.data.num
                const resolve = this.resolves[num]
                delete this.resolves[num]
                if (e.data.failed) {
                    console.warn("WebP image convert failed")
                }
                this.canvas.width = id.width;
                this.canvas.height = id.height;
                this.ctx.putImageData(id, 0, 0);
                //sharedAb = null
                //sharedU8 = null
                resolve(this.canvas.toDataURL("image/jpeg"))
            }
            this.worker.postMessage(
                {
                    binary: u8array,
                    num: this.cnt
                },
                //[sharedAb]
            )
            this.cnt++;
        })

    }
}

const openImageDecoder = new ImageDecoder()
const crossImageDecoder = new ImageDecoder()


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
    "drawHairLine": true
})

//const state = resetState()

let viewer = document.querySelector("#main-viewer")
let viewer_ctx = viewer.getContext("2d")

async function connectDatabase(state) {
    state.zipDBHandler = (window.indexedDB)
        ? (!navigator.userAgent.match("Edge"))
            ? new DatabaseHandler("zipfiles", 2, "zip", "id")
            : new DummyDatabaseHandler("zipfiles", 2, "zip", "id")
        : new DummyDatabaseHandler("zipfiles", 2, "zip", "id")
    state.zipDB = await state.zipDBHandler.connect()
    state.storedKeys = await state.zipDBHandler.getAllKeys(state.zipDB)
    return state
};

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
        showErrorCard("<p>Internet disconnected.</p>")()
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





const updateStateByMeta = (state, containorID) => (meta) => new Promise((res, rej) => {


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

function selectImageFromZip(zip, prefix) {
    if (prefix + ".JPG" in zip) {
        return ["jpeg", zip[prefix + ".JPG"]]
    } else if (prefix + ".jpg" in zip) {
        return ["jpeg", zip[prefix + ".jpg"]]
    } else if (prefix + ".jpeg" in zip) {
        return ["jpeg", zip[prefix + ".jpeg"]]
    } else if (prefix + ".webp" in zip) {
        return ["webp", zip[prefix + ".webp"]]
    }
}

function updateImageSrc(zip) {
    return (state) => new Promise(async (res, rej) => {
        state.open_images = await Promise.all(Array(state.image_number - 1)
            .fill(0)
            .map((_, i) => selectImageFromZip(zip, `o${i + 1}`))
            .map((type_image, i) => openImageDecoder.decode(type_image[1], type_image[0])
                .then(loadImageSrc)
            ))

        state.cross_images = await Promise.all(Array(state.image_number - 1)
            .fill(0)
            .map((_, i) => selectImageFromZip(zip, `c${i + 1}`))
            .map((type_image, i) => crossImageDecoder.decode(type_image[1], type_image[0])
                .then(loadImageSrc)
            ))

        /* 表示までの時間を短くしたい...
        Promise.race([
            ...(Array(state.image_number - 1)
                .fill(0)
                .map((_, i) => selectImageFromZip(zip, `o${i + 1}`))
                .map((type_image, i) => new Promise((_res, rej) => {
                    Promise.resolve(openImageDecoder.decode(type_image[1], type_image[0]))
                        .then(loadImageSrc)
                        .then(img => {
                            state.open_images[i] = img;
                            _res(`image o${i + 1} set`)
                        })
                }))
            ),

            ...(Array(state.image_number - 1)
                .fill(0)
                .map((_, i) => selectImageFromZip(zip, `c${i + 1}`))
                .map((type_image, i) => new Promise((_res, rej) => {
                    crossImageDecoder.decode(type_image[1], type_image[0])
                        .then(loadImageSrc)
                        .then(img => {
                            state.cross_images[i] = img;

                            _res(`image c${i + 1} set`)
                        })
                }))
            )
        ])
            .then(msg => {
                console.log(msg)
                res(state)
            });
        */

        res(state)
    })
}

const handleErrors = (response) => {
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

const showLoadingAnimation = state => {
    const anime = document.querySelector(".lds-css.ng-scope")
    anime.classList.remove("inactive")
    return state
}

const hideLoadingAnimation = state => {
    const anime = document.querySelector(".lds-css.ng-scope")
    anime.classList.add("inactive")
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

function hideErrorCard() {
    return _ => {
        const errorCard = document.querySelector("#error_notification")
        errorCard.classList.add("inactive")
        return _
    }
}

function showErrorCard(messageHTML) {
    return (e) => {
        const errorCard = document.querySelector("#error_notification")
        errorCard.innerHTML = messageHTML;
        errorCard.classList.remove("inactive")
        return e
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

function progressHandler(evt) {
    const open_progress = progressCircle("#open-progress")
    const cross_progress = progressCircle("#cross-progress")
    const load = (100 * evt.loaded / evt.total | 0);
    open_progress(load * 0.01)
    cross_progress(load * 0.01)
}

function completeHandler() {
    const open_progress = progressCircle("#open-progress")
    const cross_progress = progressCircle("#cross-progress")
    open_progress(0)
    cross_progress(0)
}

const unziper = (url) => new Promise((res, rej) => {
    Zip.inflate_file(url, res, rej, progressHandler, completeHandler)
})


function buffer_to_string(buf) {
    const decoder = new TextDecoder("UTF-8");
    return decoder.decode(new Uint8Array(buf))
}

function base64ToBlob(base64, mime) {
    var binary = atob(base64);
    var buffer = new Uint8Array(binary.length)
    for (var i = 0; i < binary.length; i++) {
        buffer[i] = binary.charCodeAt(i);
    }
    return new Blob([buffer.buffer], {
        type: mime
    });
}

function base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function objectFrom(keys_values) {
    const o = {}
    keys_values.forEach(kv => {
        o[kv[0]] = kv[1]
    })
    return o
}

async function polyfillWebp(name_file, i, a) {
    const [name, file] = name_file;
    const imageDecoder = new ImageDecoder()

    if (name.includes(".json")) {
        return [name, file]
    } else {
        const type = name.match(/.*\.(\w+)$/)[1]
        const base64 = await imageDecoder.decode(file, type)
        const mime = base64.match(/^data:(image\/\w+);/)[1]
        const mime_type = mime.split("/")[1]

        const new_file_name = name.split(".")[0] + "." + mime_type
        return [new_file_name, new Uint8Array(base64ToArrayBuffer(base64.split(",")[1]))]
    }
}

function inflate(name_file) {
    const [name, file] = name_file;
    return [name, file.inflate()]
}

/**
 *
 * @param {*} zip
 * @return {Object[meta,zip]}
 */
const extractFile = async zipByte => {
    const zip = Zip.inflate(zipByte)

    loadingMessage.message("Processing images")

    const result = objectFrom(
        await Promise.all(
            Object.entries(zip.files)
                .map(inflate)
            //.map(polyfillWebp)
        )
    )

    return result
}

/**
 *
 * @param {*} state
 * @param {*} key
 * @return {Object[meta,zip]}
 */
const registerZip = (state, key, timestamp) => async inflated_zip => {

    const newOne = await state.zipDBHandler.put(state.zipDB, {
        "id": key,
        "zip": inflated_zip,
        "lastModified": timestamp
    })

    state.storedKeys.push(key)

    if (state.storedKeys.length > 20) {
        const oldest = state.storedKeys.shift()
        const deleted = await state.zipDBHandler.delete(state.zipDB, oldest)
        Array.from(document.querySelectorAll(`#rock_selector>option[value=${oldest}]`)).forEach(option => {
            label = option.innerHTML.replace("✓ ", "")
            option.innerHTML = label
            option.classList.remove("downloaded")
        })
    }

    return inflated_zip
}

/**
 *
 * @param {*} packageName
 * @return {Object[meta,zip]}
 */
const markDownloadedOption = packageName => inflated_zip => new Promise((res, rej) => {
    Array.from(document.querySelectorAll(`#rock_selector>option[value=${packageName}]`)).forEach(option => {
        label = option.innerHTML.replace("✓ ", "")
        option.innerHTML = "✓ " + label
        option.classList.add("downloaded")
    })
    res(inflated_zip)
})

/**
 * package をどこかから取得する
 * @param {*} state
 * @param {*} packageName
 */
const zipUrlHandler = (state, packageName) => new Promise(async (res, rej) => {
    loadingMessage.message("Loading images")

    const key = sanitizeID(packageName)
    const zipURL = staticSettings.getImageDataPath(packageName)

    try {
        const header = await fetch(zipURL, { method: 'HEAD' }).catch(e => {
            console.log("Package metadata cannot be fetched.")
            throw Error(e)
        })
        var lastModified = header.headers.get("last-modified")
    } catch (e) {
        var lastModified = "none"
        var networkDisconnected = true
    }

    const storedData = await state.zipDBHandler.get(state.zipDB, key)


    if (storedData !== undefined && storedData.lastModified === lastModified) {
        res(storedData.zip)
    } else if (networkDisconnected) {
        if (storedData !== undefined) {
            res(storedData.zip)
        } else {
            res()
        }
    } else {
        unziper(zipURL, rej)
            .then(extractFile)
            .then(registerZip(state, key, lastModified))
            .then(markDownloadedOption(packageName))
            .then(res)
            .catch(rej)
    }
})

function extractManifestFromZip(zip) {
    return JSON.parse(buffer_to_string(zip["manifest.json"]))
}

const rockNameSelectHandler = state => {
    return new Promise(async (res, rej) => {
        const rock_selector = document.querySelector("#rock_selector")
        const packageName = rock_selector.options[rock_selector.selectedIndex].value

        showLoadingAnimation(state)
        hideWelcomeBoard(state)
        showViewer(state)
        showNicolButton(state)

        const zip = await zipUrlHandler(state, packageName)

        try {
            const manifest = await extractManifestFromZip(zip)
            updateStateByMeta(state, packageName)(manifest)
                .then(updateImageSrc(zip))
                .then(updateViewDiscription)
                .then(res)
        } catch (e) {
            rej(e)
        }
    })
}

function sanitizeID(id) {
    return id.replace(/\//g, "_").replace(/\./g, "")
}


const updateImages = state => imgSets => new Promise((res, rej) => {
    state.open_images = imgSets.open
    state.cross_images = imgSets.cross
    res(state)
})


/**
 * @parameter src {dataURL}
 */
function loadImageSrc(src) {
    return new Promise((res, rej) => {
        const returnImg = (img) => e => {
            res(img)
        }

        const img = new Image()
        img.src = src
        res(img)
        //img.addEventListener("load", returnImg(img), false)
        //img.addEventListener("error", returnImg(img), false)
    })
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
        .then(updateImages(state))
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
