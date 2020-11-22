import initState from "./initState.js"
import PackageManifest from "./package_manifest.js"
import updateViewerGeometry from "./updateViewerGeometry.js"
import updateStateByMeta from "./updateStateByMeta.js"
import { showViewer, showNicolButton } from "./viewer_handlers.js"
import { viewer } from "./viewer_canvas.js"
import { clearView, blobToCanvas, drawHairLine, drawScale } from "./draw_state_updators.js"
import { canvasCoordinate } from "./coordinate_updators.js"
import { touchStartHandler, touchEndHandler, touchMoveHandler } from "./touchEventHandlers.js"
import { wheelHandler } from "./wheelEventHandler.js"

const packageMap = new PackageManifest();
const upload_state = Object.assign(
    initState(),
    {
        "loadImages": [false, true],
        "autoRotate": false,
        "viewMode": "validation",
        "language": "ja",
        "desiredImageSize": 150,
        "desiredThumbnailImageSize": 100,
    }
)

function bothImagesLoaded(flags) {
    return flags.reduce((acc, e) => acc && e, true)
}

function fileSelectHander(e) {
    function read(file) {
        return new Promise((res, rej) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = function () {
                res(reader.result)
            };
        })
    }

    return new Promise((res, rej) => {
        const files = e.target.files;
        Promise.all(
            Array.from(files)
                .map(file => read(file))
        ).then(res)
    })
}

function readImageSize(state) {
    packageMap.setImageSize(state.open_images[0])
    return state
}

function readImagesNumber(state) {
    packageMap.setImagesNumber(state.open_images.length)
    return state
}

async function showImages(state) {
    readImageSize(state)
    readImagesNumber(state)
    const new_state = await updateStateByMeta(state, "upload")(packageMap.packageID, packageMap.toJSON())

    new_state.open_images = await Promise.all(state.open_image_srcs.map(loadImageFromSrc))
    new_state.cross_images = await Promise.all(state.cross_image_srcs.map(loadImageFromSrc))

    return updateView(new_state)
        .then(showViewer)
        .then(showNicolButton)
}

function loadImageFromSrc(src) {
    return new Promise((res, rej) => {

        const img = new Image()

        img.onload = _ => {
            res(img)
        }

        img.src = src

    })
}

function openImagesSelectHandler(state) {
    return e => new Promise(async (res, rej) => {
        state.open_image_srcs = await fileSelectHander(e)
        state.loadImages[0] = true
        state.open_images = await Promise.all(state.open_image_srcs.map(loadImageFromSrc))
        await showImages(state)

        res(state)
    })
}

function crossImagesSelectHandler(state) {
    return e => new Promise(async (res, rej) => {
        state.cross_image_srcs = await fileSelectHander(e)
        state.loadImages[1] = true
        state.cross_images = await Promise.all(state.cross_image_srcs.map(loadImageFromSrc))
        await showImages(state)

        res(state)
    })
}

async function updateView(state) {
    clearView(state)
    blobToCanvas(state)
    drawHairLine(state)
    drawScale(state)
    return state
}


function activateDom(selector) {
    Array.from(document.querySelectorAll(selector))
        .forEach(dom => {
            dom.classList.remove("inactive")
        })
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

function compressImageSrc(src, format, desiredKByte = 150) {
    console.assert(["jpeg", "webp"].includes(format))

    const image = new Image()
    image.src = src
    const w = image.width
    const h = image.height
    const cvs = document.querySelector("#working_canvas")
    cvs.width = w
    cvs.height = h
    const ctx = cvs.getContext("2d")
    ctx.drawImage(image, 0, 0, w, h)

    const originalBinary = cvs.toDataURL(`image/${format}`); //画質落とさずバイナリ化
    const mime = originalBinary.match(/(:)([a-z\/]+)(;)/)[2]

    const originalBlob = base64ToBlob(originalBinary.split(",")[1], mime);

    if (desiredKByte * 1e3 < originalBlob["size"]) {
        const capacityRatio = desiredKByte * 1e3 / originalBlob["size"];
        const processingBinary = cvs.toDataURL(`image/${format}`, capacityRatio); //画質落としてバイナリ化
        return base64ToBlob(processingBinary.split(",")[1], mime);
    } else {
        return originalBlob
    }
}

function showErrorMessage(domId, message) {
    const messageDom = document.querySelector(domId)
    messageDom.innerHTML = message
    messageDom.classList.remove("inactive")
}

function hideErrorMessage(domId) {
    const messageDom = document.querySelector(domId)
    messageDom.classList.add("inactive")
}


function sendSampleListEntry(json_obj) {
    if (json_obj["package-name"].match(new RegExp("^[0-9a-zA-Z_-]+$")) === null) {
        throw new Error("Package ID should contain only number, alphabet, _, and -.")
    }
    if (Object.keys(json_obj["list-name"]).length === 0) {
        throw new Error("Sample title is not set.")
    }
    document.querySelector("#dev_sample_list_entry").innerHTML = JSON.stringify(json_obj, null, 2)
};

function initializeOrUpdateInput(inputDom, value) {
    if (!inputDom.value) {
        inputDom.value = value
    }
}

function showPackageSize(state) {
    // Sum open and cross images (contains thumbnail)
    const imagesSize = (state.open_image_srcs.length * state.desiredImageSize + state.desiredThumbnailImageSize) * 2
    document.querySelector("#message_package_size").innerHTML = imagesSize
}

(function (state) {
    document.querySelector("#input_package_id").addEventListener(
        "change",
        e => {
            packageMap.setPackageID(e.target.value)
        },
        false
    )

    document.querySelector("#input_desired_image_size").addEventListener(
        "change",
        e => {
            state.desiredImageSize = parseFloat(e.target.value)
            showPackageSize(state)
        },
        false
    )

    document.querySelector("#input_desired_thumbnail_image_size").addEventListener(
        "change",
        e => {
            state.desiredThumbnailImageSize = parseFloat(e.target.value)
            showPackageSize(state)
        },
        false
    )

    const centerToRight = document.querySelector("#rotate_center_from_left")
    centerToRight.addEventListener(
        "change",
        e => {
            state.rotate_center.to_right = parseFloat(centerToRight.value)
            updateView(state)
        },
        false
    )
    const centerToBottom = document.querySelector("#rotate_center_from_top")
    centerToBottom.addEventListener(
        "change",
        e => {
            state.rotate_center.to_bottom = parseFloat(centerToBottom.value)
            updateView(state)
        },
        false
    )

    document.querySelector("#open_nicol_images").addEventListener(
        "change",
        e => {
            openImagesSelectHandler(state)(e).then(state => {
                initializeOrUpdateInput(centerToRight, state.open_images[0].width / 2)
                initializeOrUpdateInput(centerToBottom, state.open_images[0].height / 2)
                showPackageSize(state)
            })
        },
        false
    )

    document.querySelector("#cross_nicol_images").addEventListener(
        "change",
        e => {
            crossImagesSelectHandler(state)(e).then(state => {
                initializeOrUpdateInput(centerToRight, state.cross_images[0].width / 2)
                initializeOrUpdateInput(centerToBottom, state.cross_images[0].height / 2)
                showPackageSize(state)
            })
        },
        false
    )

    const rotateDirectionSelector = document.querySelector("#select_rotate_direction")
    rotateDirectionSelector.addEventListener(
        "change",
        e => {
            const direction = e.target.options[e.target.selectedIndex].value
            packageMap.setRotateDirection(direction)
        },
        false
    )

    const inputRotationInterval = document.querySelector("#input_rotation_interval")
    inputRotationInterval.addEventListener(
        "change",
        e => {
            packageMap.setEachRotateDegree(inputRotationInterval.value)
            activateDom("#select_image_wrapper")
        },
        false
    )

    const inputScaleUnit = document.querySelector("#input_scale_unit")
    inputScaleUnit.addEventListener(
        "change",
        e => {
            packageMap.setScaleUnit(inputScaleUnit.value)
        },
        false
    )

    const inputScaleLength = document.querySelector("#input_scale_length")
    inputScaleLength.addEventListener(
        "change",
        e => {
            packageMap.setScalePixel(inputScaleLength.value)
        },
        false
    )

    const inputMagnification = document.querySelector("#input_magnification")
    inputMagnification.addEventListener(
        "change",
        e => {
            packageMap.setMagnify(e.target.value)
        },
        false
    )

    Array.from(document.querySelectorAll(".input_sample_location")).forEach(dom => {
        dom.addEventListener(
            "change",
            e => {
                packageMap.setSampleLocation(e.target.dataset.lang, e.target.value)
            },
            false
        )
    })

    Array.from(document.querySelectorAll(".input_sample_type")).forEach(dom => {
        dom.addEventListener(
            "change",
            e => {
                packageMap.setRockType(e.target.dataset.lang, e.target.value)
            },
            false
        )
    })

    Array.from(document.querySelectorAll(".input_description")).forEach(dom => {
        dom.addEventListener(
            "change",
            e => {
                packageMap.setDescription(e.target.dataset.lang, e.target.value)
            },
            false
        )
    })

    Array.from(document.querySelectorAll(".input_sample_title"))
        .forEach(dom => {
            dom.addEventListener(
                "change",
                e => {
                    packageMap.setListName(e.target.dataset.lang, e.target.value)

                }
            )
        })

    Array.from(document.querySelectorAll(".input_owner")).forEach(dom => {
        dom.addEventListener(
            "change",
            e => {
                packageMap.setOwner(e.target.dataset.lang, e.target.value)
            },
            false
        )
    })

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

    viewer.oncontextmenu = function (e) {
        const position_on_canvas = canvasCoordinate(e)
        const current_rotate_center = Object.values(state.rotate_center)
        const shift = [
            position_on_canvas[0] - state.canvasWidth * 0.5,
            position_on_canvas[1] - state.canvasHeight * 0.5
        ]

        state.rotate_center.to_right += parseInt(shift[0] * state.imageRadius / state.canvasWidth * 2)
        state.rotate_center.to_bottom += parseInt(shift[1] * state.imageRadius / state.canvasWidth * 2)

        packageMap.setRotateCenter(
            state.rotate_center.to_right,
            state.rotate_center.to_bottom
        )

        centerToRight.value = state.rotate_center.to_right
        centerToBottom.value = state.rotate_center.to_bottom

        e.preventDefault()
        updateView(state)
        return false;
    }

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

    document.querySelector("#create_package_button").addEventListener(
        "click",
        e => {
            e.preventDefault()
            async function makeZip() {
                const listEntry = packageMap.getSampleListEntry()
                sendSampleListEntry(listEntry)

                const zip = new JSZip();
                const jpgZip = new JSZip()
                const webpZip = new JSZip()

                if (state.open_image_srcs.length === 0) {
                    throw new Error("No open Nicol images are selected.")
                }
                if (state.cross_image_srcs.length === 0) {
                    throw new Error("No crossed Nicol images are selected.")
                }

                // Thumbnails
                zip.file("o1.jpg", compressImageSrc(state.open_image_srcs[0], "jpeg", state.desiredThumbnailImageSize))
                zip.file("c1.jpg", compressImageSrc(state.cross_image_srcs[0], "jpeg", state.desiredThumbnailImageSize))

                // Image sets
                packageMap.setImageFormats(["webp", "jpg"])
                state.open_image_srcs.forEach((src, i) => {
                    webpZip.file(`o${i + 1}.webp`, compressImageSrc(src, "webp", state.desiredImageSize))
                    jpgZip.file(`o${i + 1}.jpg`, compressImageSrc(src, "jpeg", state.desiredImageSize))
                })
                state.cross_image_srcs.forEach((src, i) => {
                    webpZip.file(`c${i + 1}.webp`, compressImageSrc(src, "webp", state.desiredImageSize))
                    jpgZip.file(`c${i + 1}.jpg`, compressImageSrc(src, "jpeg", state.desiredImageSize))
                })

                const meta = new Blob([JSON.stringify(packageMap.toJSON(), null, 2)], { "type": "text/json" });
                zip.file("manifest.json", meta)
                zip.file("webp.zip", await webpZip.generateAsync({ type: "blob" }))
                zip.file("jpg.zip", await jpgZip.generateAsync({ type: "blob" }))
                const zipContent = await zip.generateAsync({ type: "blob" })

                const a = document.querySelector("#working_anchor")
                a.download = `${packageMap.getPackageID()}.zip`
                a.href = window.URL.createObjectURL(zipContent)
                a.click()

            }
            makeZip()
                .then(() => {
                    hideErrorMessage("#error_make_package")
                })
                .catch(e => {
                    showErrorMessage("#error_make_package", e)
                })
        },
        false
    )

    updateViewerGeometry(state)
})(upload_state)
