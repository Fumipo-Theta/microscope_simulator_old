/**
 *  Images are: 12 images for both open and cross nickol.
 *  Images must be taken by each 15 degree.
 */

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
    "rotate_start": 0,
    "rotate_end": 0,
    "isClockwise": true,
    "isCrossNicol": false,
    "metaContainor": {},
    "zipContainor": {},
})

const state = resetState()

const viewer = document.querySelector("#main-viewer")
const viewer_ctx = viewer.getContext("2d")


const windowResizeHandler = state => new Promise((res, rej) => {
    state.canvasWidth = getMinimumWindowSize() - 20
    state.canvasHeight = getMinimumWindowSize() - 20

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



const updateStateByMeta = (state, directory_name) => (response) => new Promise((res, rej) => {

    const { meta, zip } = response;

    state.containorID = sanitizeID(directory_name);
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
    state.imageRadius = meta.image_radius
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
    const image_number = cycle_degree / rotate_degree_step + 1 // 7: 0, 15, 30, 45, 60, 75, 90
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
    state.open_image_srcs = Array(image_number)
        .fill(0)
        .map((_, i) => zip.files["o" + (i + 1) + ".JPG"])
        .map(image => "data:image/png;base64," + base64String(image.inflate()))

    state.cross_image_srcs = Array(image_number)
        .fill(0)
        .map((_, i) => zip.files["c" + (i + 1) + ".JPG"])
        .map(image => "data:image/png;base64," + base64String(image.inflate()))
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
            <li>${state.rockType} at ${state.location}</li>
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

const extractFile = zip => {
    meta = zip.files["manifest.json"]
    const decoder = new TextDecoder("UTF-8");

    function buffer_to_string(buf) {
        return decoder.decode(new Uint8Array(buf))
    }

    return {
        "meta": JSON.parse(buffer_to_string(meta.inflate())),
        "zip": zip
    }
}

const reselectFile = (state, key) => new Promise((res, rej) => {
    res({
        "meta": state.metaContainor[key],
        "zip": state.zipContainor[key]
    })
})

const registerZip = (state, key) => response => {
    const { meta, zip } = response;
    state.metaContainor[key] = meta;
    state.zipContainor[key] = zip
    return response
}

const zipUrlHandler = (state, url) => new Promise((res, rej) => {

    const key = sanitizeID(url)

    if (key in state.zipContainor) {
        reselectFile(state, key)
            .then(res)
    } else {
        unziper(url)
            .then(extractFile)
            .then(registerZip(state, key))
            .then(res)
            .catch(rej)
    }
})

const rockNameSelectHandler = state => {
    return new Promise((res, rej) => {
        const rock_selector = document.querySelector("#rock_selector")
        const directory_name = `./zipped/${rock_selector.options[rock_selector.selectedIndex].value}/`
        const zipfileName = `./zipped/${rock_selector.options[rock_selector.selectedIndex].value}.zip`

        showLoadingAnimation(state)
        hideWelcomeBoard(state)
        showViewer(state)
        showNicolButton(state)

        zipUrlHandler(state, zipfileName)
            .then(updateStateByMeta(state, zipfileName))
            .then(updateViewDiscription)
            .then(res)
            .catch(rej)
    })
}

function sanitizeID(id) {
    return id.replace(/\//g, "_").replace(/\./g, "")
}


const createImageContainor = state => new Promise((res, rej) => {

    const containor = document.querySelector(".image_containor")
    const subcontainors = containor.querySelectorAll("div")





    function containorIsExist(doms, id) {
        return Array.from(doms)
            .map(d => d.id)
            .filter(d => d === id)
            .length > 0
    }

    if (containorIsExist(subcontainors, sanitizeID(state.containorID))) {
        openContainor = containor.querySelector(`#${sanitizeID(state.containorID)} .open`)
        crossContainor = containor.querySelector(`#${sanitizeID(state.containorID)} .cross`)
        state.open_images = Array.from(openContainor.querySelectorAll("img"))
        state.cross_images = Array.from(crossContainor.querySelectorAll("img"))
        res(state)
    } else {
        subcontainor = document.createElement("div")
        subcontainor.id = sanitizeID(state.containorID)
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
                state.open_images = imgDOMs[0].map(img => {
                    openContainor.appendChild(img)
                    return img
                })

                state.cross_images = imgDOMs[1].map(img => {
                    crossContainor.appendChild(img)
                    return img
                })

                return res(state)
            })
    }
})

/**
 *  range of state.rotate is 0 <= degree < 360
 */

const clipGeometoryFromImageCenter = (imgDOM, state) => {
    img_height = imgDOM.height
    img_width = imgDOM.width
    return [
        (img_width - state.imageRadius) * 0.5,
        (img_height - state.imageRadius) * 0.5,
        state.imageRadius,
        state.imageRadius
    ]
}

const clearView = state => {
    viewer_ctx.save()
    viewer_ctx.rotate(-rotateSign(state.isClockwise) * state.rotate / 180 * Math.PI)
    viewer_ctx.clearRect(-state.canvasWidth * 0.5, -state.canvasHeight * 0.5, state.canvasWidth, state.canvasHeight)
    viewer_ctx.restore()
}

const blobToCanvas = (state) => {

    image_srcs = state.isCrossNicol
        ? state.cross_images
        : state.open_images

    // view window circle

    viewer_ctx.save()
    viewer_ctx.beginPath()
    viewer_ctx.arc(0, 0, state.canvasWidth / 2, 0, Math.PI * 2, false)
    viewer_ctx.clip()

    // Draw a image
    alpha = state.getAlpha(state.rotate)



    viewer_ctx.rotate(rotateSign(state.isClockwise) * state.getImageNumber(state.rotate) * 15 * Math.PI / 180)


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
    viewer_ctx.arc(0, 0, state.canvasWidth / 2, 0, Math.PI * 2, false)
    viewer_ctx.clip()
    viewer_ctx.rotate(rotateSign(state.isClockwise) * state.getImageNumber(state.rotate + 15) * 15 * Math.PI / 180)

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
    viewer_ctx.save()
    viewer_ctx.strokeStyle = state.isCrossNicol
        ? "white"
        : "black";
    viewer_ctx.globalAlpha = 1
    viewer_ctx.rotate(-rotateSign(state.isClockwise) * state.rotate / 180 * Math.PI)
    viewer_ctx.beginPath()
    viewer_ctx.moveTo(0, -state.canvasHeight * 0.5)
    viewer_ctx.lineTo(0, state.canvasHeight)
    viewer_ctx.moveTo(-state.canvasWidth * 0.5, 0)
    viewer_ctx.lineTo(state.canvasWidth * 0.5, 0)
    viewer_ctx.closePath()
    viewer_ctx.stroke()
    viewer_ctx.restore()
}

const scaleLength = (canvasWidth, imageWidth, scaleWidth) => canvasWidth * scaleWidth / imageWidth

const drawScale = state => {
    if (!state["scaleWidth"]) return;
    scalePixel = scaleLength(state.canvasWidth, state.imageRadius, state.scaleWidth)

    viewer_ctx.save()
    viewer_ctx.rotate(-rotateSign(state.isClockwise) * state.rotate / 180 * Math.PI)
    viewer_ctx.fillStyle = "white"
    viewer_ctx.fillRect(
        state.canvasWidth * 0.5 - scalePixel - 5,
        state.canvasHeight * 0.5 - 10 - 5,
        scalePixel,
        10
    )
    viewer_ctx.font = "16px Arial"
    viewer_ctx.textAlign = "center"
    viewer_ctx.fillText(
        state.scaleText,
        state.canvasWidth * 0.5 - 5 - scalePixel * 0.5,
        state.canvasHeight * 0.5 - 15 - 5
    )
    viewer_ctx.restore()
}

const updateState = (state, newState) => new Promise((res, rej) => {
    _state = Object.assign(state, newState)
    console.log(_state)
    res(_state)
})

const firstView = (state) => {
    clearView(state)
    blobToCanvas(state)
    drawHairLine(state)
    drawScale(state)
}

const updateView = (state) => {
    clearView(state)
    blobToCanvas(state)
    drawHairLine(state)
    drawScale(state)
}


const getCoordinateOnCanvas = canvas => e => {
    if (e instanceof MouseEvent) {
        return [
            e.pageX - canvas.offsetLeft,
            e.pageY - canvas.offsetTop
        ]
    } else if (e instanceof TouchEvent) {
        return [
            e.touches[0].pageX - canvas.offsetLeft,
            e.touches[0].pageY - canvas.offsetTop
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
    state.drag_start = state.drag_end
    state.drag_end = canvasCoordinate(e)
}

/**
 * Calculate small difference of rotation.
 * Update total rotation.
 *
 * @param {*} state
 * @param {*} e
 */
const updateRotate = (state, e) => {

    // delta rotate radius
    state.rotate_end = radiunBetween(
        state.canvasWidth * 0.5,
        state.canvasHeight * 0.5
    )(...state.drag_end, ...state.drag_start)

    state.rotate += state.rotate_end / Math.PI * 180
    if (state.rotate >= 360) {
        state.rotate -= 360
    } else if (state.rotate < 0) {
        state.rotate += 360
    }
}



const rotateImage = (state, e) => () => {
    updateCoordinate(state, e)
    updateRotate(state, e)
    viewer_ctx.rotate(rotateSign(state.isClockwise) * (state.rotate_end))

    blobToCanvas(state)
    drawHairLine(state)
    drawScale(state)
}

const touchStartHandler = e => {
    state.isMousedown = true
    state.drag_end = canvasCoordinate(e)
    e.preventDefault();
}

const touchMoveHandler = e => {
    if (state.isMousedown) {
        e.preventDefault();
        requestAnimationFrame(
            rotateImage(state, e)
        )
    } else {

    }
    //if (e.cancelable) {

    //}
}

const touchEndHandler = e => {
    state.isMousedown = false
    state.rotate_start = 0
    state.rotate_end = 0
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
        .then(firstView)
        .then(hideLoadingAnimation)
        .catch(console.log),
    false
)


viewer.addEventListener(
    "mousedown",
    touchStartHandler,
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
    touchStartHandler,
    false
)

viewer.addEventListener(
    "mousemove",
    touchMoveHandler,
    false
)

viewer.addEventListener(
    "touchmove",
    touchMoveHandler,
    false
)

viewer.addEventListener(
    "mouseup",
    touchEndHandler,
    false
)

viewer.addEventListener(
    "touchend",
    touchEndHandler,
    false
)

/*viewer.addEventListener(
    "mouseout",
    e => {
        state.isMousedown = false
        state.rotate_start = 0
        state.rotate_end = 0
    },
    false
)*/


//window.onload = e => {
windowResizeHandler(state)
    //.then(rockNameSelectHandler)
    //.then(createImageContainor)
    //.then(firstView)
    .then(hideLoadingAnimation)
    .catch(hideLoadingAnimation)
//}

window.onresize = e => {
    //windowResizeHandler(state)
    //.then(rockNameSelectHandler(state)())
    //.then(createImageContainor)
    //.then(updateView)
}
