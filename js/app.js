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
    const height = window.innerHeight
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
})

const state = resetState()

const viewer = document.querySelector("#main-viewer")
const viewer_ctx = viewer.getContext("2d")


const windowResizeHandler = state => new Promise((res, rej) => {
    state.canvasWidth = getMinimumWindowSize() <= 800
        ? getMinimumWindowSize() - 20
        : 800 - 20
    state.canvasHeight = getMinimumWindowSize() <= 800
        ? getMinimumWindowSize() - 20
        : 800 - 20

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



const getMetadata = response => new Promise((res, rej) => {
    try {
        res(response.json())
    } catch{
        rej("No directory")
    }


})

const updateStateByMeta = (state, directory_name) => meta => new Promise((res, rej) => {
    state.containorID = directory_name
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

    state.open_image_srcs = Array(image_number)
        .fill(0)
        .map((_, i) => directory_name + "o" + (i + 1) + ".jpg")

    state.cross_image_srcs = Array(image_number)
        .fill(0)
        .map((_, i) => directory_name + "c" + (i + 1) + ".jpg")

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
    anime = document.querySelector(".lds-css.ng-scope")
    anime.classList.remove("inactive")
    return state
}

const hideLoadingAnimation = state => {
    anime = document.querySelector(".lds-css.ng-scope")
    anime.classList.add("inactive")
    return state
}

const rockNameSelectHandler = state => {
    return new Promise((res, rej) => {
        const rock_selector = document.querySelector("#rock_selector")
        const directory_name = `./data/${rock_selector.options[rock_selector.selectedIndex].value}/`

        showLoadingAnimation(state)

        return fetch(directory_name + "manifest.json")
            .then(handleErrors)
            .then(getMetadata)
            .then(updateStateByMeta(state, directory_name))
            .then(updateViewDiscription)
            .then(hideLoadingAnimation)
            .then(res)
    })
}


const createImageContainor = state => new Promise((res, rej) => {

    containor = document.querySelector(".image_containor")
    subcontainors = containor.querySelectorAll("div")

    function sanitizeID(id) {
        return id.replace(/\//g, "_").replace(/\./g, "")
    }

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
            e.clientX - canvas.offsetLeft,
            e.clientY - canvas.offsetTop
        ]
    } else if (e instanceof TouchEvent) {
        return [
            e.touches[0].clientX - canvas.offsetLeft,
            e.touches[0].clientY - canvas.offsetTop
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
}

const touchMoveHandler = e => {
    if (state.isMousedown) {
        requestAnimationFrame(
            rotateImage(state, e)
        )
    } else {

    }
    e.preventDefault()
}

const touchEndHandler = e => {
    state.isMousedown = false
    state.rotate_start = 0
    state.rotate_end = 0
}

const nicolText = document.querySelector("#nicol_mode")

const toggleNicolText = (hasChangedToCrossNichol) => {
    nicolText.innerHTML = hasChangedToCrossNichol
        ? "Cross Nichol"
        : "Open Nichol"
}

const toggleNicolHandler = state => new Promise((res, rej) => {
    state.isCrossNicol = !state.isCrossNicol;
    res(state)
})

const toggleNicolButton = document.querySelector("#change_nicol")

toggleNicolButton.addEventListener(
    "click",
    e => toggleNicolHandler(state)
        .then(updateView),
    false
)

toggleNicolButton.addEventListener(
    "touch",
    e => toggleNicolHandler(state)
        .then(updateView),
    false
)

const rock_selector = document.querySelector("#rock_selector")

rock_selector.addEventListener(
    "change",
    e => rockNameSelectHandler(state)
        .then(createImageContainor)
        .then(firstView)
        .catch(console.log),
    false
)


viewer.addEventListener(
    "mousedown",
    touchStartHandler,
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


window.onload = e => {
    windowResizeHandler(state)
        .then(rockNameSelectHandler)
        .then(createImageContainor)
        .then(firstView)
}

window.onresize = e => {
    windowResizeHandler(state)
        //.then(rockNameSelectHandler(state)())
        //.then(createImageContainor)
        .then(updateView)
}
