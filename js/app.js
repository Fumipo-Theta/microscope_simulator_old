/**
 *  Images are: 12 images for both open and cross nickol.
 *  Images must be taken by each 15 degree.
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

function es6Available() {
    return (typeof Symbol === "function" && typeof Symbol() === "symbol")
}


function selectCountry() {
    const code = (window.navigator.languages && window.navigator.languages[0]) ||
        window.navigator.language ||
        window.navigator.userLanguage ||
        window.navigator.browserLanguage;

    document.querySelector(`option[value=${code}]`).selected = true

    return code === "ja" ? "ja" : "en";
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
    "language": selectCountry(),
    "storedKeys": [],
})

async function connectDatabase(state) {
    state.zipDBHandler = (window.indexedDB)
        ? (navigator.userAgent.match("Edge"))
            ? new DatabaseHandler("zipfiles", 2, "zip", "id")
            : new DummyDatabaseHandler("zipfiles", 2, "zip", "id")
        : new DummyDatabaseHandler("zipfiles", 2, "zip", "id")
    state.zipDB = await state.zipDBHandler.connect()
    state.storedKeys = await state.zipDBHandler.getAllKeys(state.zipDB)
    return state
}

const state = resetState()

let viewer = document.querySelector("#main-viewer")
let viewer_ctx = viewer.getContext("2d")


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
    } catch (e) {
        var response = { "list_of_sample": [] }
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

const loadImageSrc = (src) => new Promise((res, rej) => {
    const returnImg = (img) => e => {
        res(img)
    }

    img = document.createElement("img")
    img.src = src
    img.addEventListener("load", returnImg(img), false)
    img.addEventListener("error", returnImg(img), false)
})



const updateStateByMeta = (state, containorID) => (zip) => new Promise((res, rej) => {

    const meta = JSON.parse(buffer_to_string(zip["manifest.json"]))

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

    state.getImageNumber = getImageNumber = cycle_degree > 0
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

    function base64String(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
    state.open_image_srcs = Array(image_number - 1)
        .fill(0)
        .map((_, i) => zip["o" + (i + 1) + ".JPG"])
        .map(image => "data:image/png;base64," + base64String(image))

    state.cross_image_srcs = Array(image_number - 1)
        .fill(0)
        .map((_, i) => zip["c" + (i + 1) + ".JPG"])
        .map(image => "data:image/png;base64," + base64String(image))
    res(state)
})

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
    const discription = document.querySelector("#view_discription")

    const textTemplate = state => {
        return `<ul style="list-style-type:none;">
            <li>${state.rockType} ${state.location ? "at " + state.location : ""}</li>
            <li>${state.discription}</li>
            <li>Owner: ${state.owner}</li>
        </ul>`
    }

    discription.innerHTML = textTemplate(state);
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



const unziper = (url) => new Promise((res, rej) => {
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
        const open_progress = progressCircle("#open-progress", state.image_number)
        const cross_progress = progressCircle("#cross-progress", state.image_number)
        const load = (100 * evt.loaded / evt.total | 0);
        open_progress(load * 0.01)
        cross_progress(load * 0.01)
    }

    function completeHandler() {
        const open_progress = progressCircle("#open-progress", state.image_number)
        const cross_progress = progressCircle("#cross-progress", state.image_number)
        open_progress(0)
        cross_progress(0)
    }
    Zip.inflate_file(url, res, rej, progressHandler, completeHandler)
})


function buffer_to_string(buf) {
    const decoder = new TextDecoder("UTF-8");
    return decoder.decode(new Uint8Array(buf))
}


/**
 *
 * @param {*} zip
 * @return {Object[meta,zip]}
 */
const extractFile = zipByte => {
    const zip = Zip.inflate(zipByte)
    const inflated_zip = {}
    Object.entries(zip.files).forEach(kv => {
        inflated_zip[kv[0]] = kv[1].inflate()
    })

    return inflated_zip
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
    const key = sanitizeID(packageName)
    const zipURL = staticSettings.getImageDataPath(packageName)

    try {
        const header = await fetch(zipURL, { method: 'HEAD' }).catch(e => { throw Error(e) })
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
        unziper(zipURL)
            .then(extractFile)
            .then(registerZip(state, key, lastModified))
            .then(markDownloadedOption(packageName))
            .then(res)
            .catch(rej)
    }
})



const rockNameSelectHandler = state => {
    return new Promise((res, rej) => {
        const rock_selector = document.querySelector("#rock_selector")
        const packageName = rock_selector.options[rock_selector.selectedIndex].value

        showLoadingAnimation(state)
        hideWelcomeBoard(state)
        showViewer(state)
        showNicolButton(state)

        zipUrlHandler(state, packageName)
            .then(updateStateByMeta(state, packageName))
            .then(updateViewDiscription)
            .then(res)
            .catch(rej)
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
 * Check images are in containor.
 * If true, set them in state object.
 * else, create img element and set them in state object.
 */
const createImageContainor = state => new Promise((res, rej) => {

    const containor = document.querySelector(".image_containor")
    const subcontainors = containor.querySelectorAll("div")

    function containorIsExist(doms, id) {
        return Array.from(doms)
            .map(d => d.id)
            .filter(d => d === id)
            .length > 0
    }

    if (containorIsExist(subcontainors, state.containorID)) {
        openContainor = containor.querySelector(`#${state.containorID} .open`)
        crossContainor = containor.querySelector(`#${state.containorID} .cross`)
        const open_imgs = Array.from(openContainor.querySelectorAll("img"))
        const cross_imgs = Array.from(crossContainor.querySelectorAll("img"))
        updateImages(state)({ open: open_imgs, cross: cross_imgs })
            .then(res)
    } else {
        subcontainor = document.createElement("div")
        subcontainor.id = state.containorID
        openContainor = document.createElement("div")
        openContainor.classList = ["open"]
        crossContainor = document.createElement("div")
        crossContainor.classList = ["cross"]

        subcontainor.appendChild(openContainor)
        subcontainor.appendChild(crossContainor)
        containor.appendChild(subcontainor)

        Promise.all([
            Promise.all(state.open_image_srcs.map(src => loadImageSrc(src))),
            Promise.all(state.cross_image_srcs.map(src => loadImageSrc(src)))
        ])
            .then(imgDOMs => {
                const open_imgs = imgDOMs[0].map(img => {
                    openContainor.appendChild(img)
                    return img
                })

                const cross_imgs = imgDOMs[1].map(img => {
                    crossContainor.appendChild(img)
                    return img
                })

                return { open: open_imgs, cross: cross_imgs }
            })
            .then(updateImages(state))
            .then(res)
    }
})

/**
 *  range of state.rotate is 0 <= degree < 360
 */

const clipGeometoryFromImageCenter = (imgDOM, state) => {
    const img_height = imgDOM.height
    const img_width = imgDOM.width

    return [
        state.rotate_center.to_right - state.imageRadius,
        state.rotate_center.to_bottom - state.imageRadius,
        state.imageRadius * 2,
        state.imageRadius * 2
    ]
}

const clearView = state => {
    //viewer_ctx.save()
    viewer_ctx.clearRect(-state.canvasWidth * 0.5, -state.canvasHeight * 0.5, state.canvasWidth, state.canvasHeight)
    //viewer_ctx.restore()
}

const blobToCanvas = (state) => {

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

    //viewer_ctx.rotate(rotateSign(state.isClockwise) * state.getImageNumber(state.rotate) * 15 * Math.PI / 180)


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
    //viewer_ctx.rotate(rotateSign(state.isClockwise) * state.getImageNumber(state.rotate + 15) * 15 * Math.PI / 180)

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
}

const drawHairLine = state => {
    //viewer_ctx.save()
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
    //viewer_ctx.restore()
}

const scaleLength = (canvasWidth, imageWidth, scaleWidth) => canvasWidth * scaleWidth / imageWidth

const drawScale = state => {
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
}

const updateState = (state, newState) => new Promise((res, rej) => {
    _state = Object.assign(state, newState)
    console.log(_state)
    res(_state)
})


const updateView = (state) => {
    clearView(state)
    blobToCanvas(state)
    drawHairLine(state)
    drawScale(state)
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
const updateCoordinate = (state, e) => {
    state.drag_start = state.drag_end || undefined
    state.drag_end = canvasCoordinate(e)

    state.pinch_start = state.pinch_end || undefined
    state.pinch_end = canvasCoordinate(e, 1)
}

/**
 * Calculate small difference of rotation.
 * Update total rotation.
 *
 * @param {*} state
 * @param {*} e
 */
const updateRotate = (state, e) => {
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
}



const rotateImage = (state, e) => () => {
    updateCoordinate(state, e)
    updateRotate(state, e)
    blobToCanvas(state)
    drawHairLine(state)
}

const updateMagnifyByPinch = (state, e) => {
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

}

const updateMagnifyByWheel = (state, e) => {
    const scrolled = canvasCoordinate(e)[1]

    const newRadius = state.imageRadius + scrolled
    state.imageRadius = (newRadius) > state.imageRadiusOriginal
        ? state.imageRadiusOriginal
        : (newRadius < 100)
            ? 100
            : newRadius

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

const nicolText = document.querySelector("#nicol_mode")

const toggleNicolButton = document.querySelector("#change_nicol")
const toggleNicolLabel = document.querySelector("#change_nicol + label")

const toggleNicolHandler = state => new Promise((res, rej) => {

    toggleNicolButton.checked = state.isCrossNicol
    state.isCrossNicol = !state.isCrossNicol;


    res(state)
})




toggleNicolButton.addEventListener(
    "click",
    e => { e.preventDefault() },
    false
)


toggleNicolLabel.addEventListener(
    "touch",
    e => { e.preventDefault() },
    false
)

toggleNicolButton.addEventListener(
    "touch",
    e => { e.preventDefault() },
    false
)


toggleNicolLabel.addEventListener(
    "mouseup",
    e => toggleNicolHandler(state)
        .then(updateView),
    false
)

toggleNicolLabel.addEventListener(
    "touchend",
    e => toggleNicolHandler(state)
        .then(updateView)
        .then(_ => {
            if (e.cancelable) {
                e.preventDefault();
            }
        }),
    false
)

const rock_selector = document.querySelector("#rock_selector")

rock_selector.addEventListener(
    "change",
    e => rockNameSelectHandler(state)
        .then(createImageContainor)
        .then(updateView)
        .then(hideLoadingAnimation)
        .catch(console.log),
    false
)


viewer.addEventListener(
    "mousedown",
    touchStartHandler(state),
    false
)

viewer.addEventListener(
    "dragstart",
    e => { e.preventDefault() },
    false
)

viewer.addEventListener(
    "drag",
    e => { e.preventDefault() },
    false
)

viewer.addEventListener(
    "dragend",
    e => { e.preventDefault() },
    false
)



viewer.addEventListener(
    "touchstart",
    touchStartHandler(state),
    false
)

viewer.addEventListener(
    "mousemove",
    touchMoveHandler(state),
    false
)

viewer.addEventListener(
    "touchmove",
    touchMoveHandler(state),
    false
)

viewer.addEventListener(
    "mouseup",
    touchEndHandler(state),
    false
)

viewer.addEventListener(
    "touchend",
    touchEndHandler(state),
    false
)

viewer.addEventListener(
    "wheel",
    wheelHandler(state),
    false
)



function languageChangeHundler(state) {
    return function (e) {
        return new Promise((res, rej) => {
            const languageSelector = document.querySelector("#language_selector")
            const lang = languageSelector.options[languageSelector.selectedIndex].value;
            state.language = lang
            res(state)
        })
    }
}

const languageSelector = document.querySelector("#language_selector")

languageSelector.addEventListener("change",
    e => languageChangeHundler(state)(e)
        .then(sampleListLoader),
    false
)

/**
 *
 * Entry point function !
 */
function init(state) {
    const userAgent = navigator.userAgent;

    // スマートフォンの場合はorientationchangeイベントを監視する
    if (userAgent.indexOf("iPhone") >= 0 || userAgent.indexOf("iPad") >= 0 || userAgent.indexOf("Android") >= 0)
        window.addEventListener(
            "orientationchange",
            e => windowResizeHandler(state).then(updateView),
            false
        );
    else
        window.addEventListener(
            "resize",
            e => windowResizeHandler(state).then(updateView),
            false
        );

    if (userAgent.match("Edge")) {
        document.querySelector("#welcome-card div img").src = "./images/SCOPin_rock_logo.png"
    }

    if (!es6Available()) {
        var warnningCard = document.getElementById("please_use_modern_browser")
        warnningCard.classList.remove("inactive")

    } else {
        windowResizeHandler(state)
            .then(connectDatabase)
            .then(sampleListLoader)
            .then(hideLoadingAnimation)
            .catch(hideLoadingAnimation)
    }
}

init(state)
