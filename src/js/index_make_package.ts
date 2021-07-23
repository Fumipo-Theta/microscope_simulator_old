import { RootState, Language } from "@src/js/type/entity"
import initState from "@src/js/state/initState"
import PackageManifest from "./package_manifest"
import updateViewerGeometry from "./updateViewerGeometry"
import updateStateByMeta from "./updateStateByMeta"
import { showViewer, showNicolButton } from "./viewer_handlers"
import { viewer } from "./viewer_canvas"
import { canvasCoordinate } from "./coordinate_updators"
import { touchStartHandler, touchEndHandler, touchMoveHandler } from "./touchEventHandlers"
import { wheelHandler } from "./wheelEventHandler"
import { viewer_ctx } from "./viewer_canvas"
import { renderCurrentStateOnCanvas } from "@src/js/component/ViewerContainer/viewer/sample_viewer"
const JSZip = require('@src/js/lib/jszip.min')

type Base64String = string;

interface State extends RootState {
    loadImages: boolean[],
    autoRotate: boolean,
    viewMode: string,
    language: Language,
    desiredImageSize: number,
    desiredThumbnailImageSize: number,
    open_image_srcs: Array<Base64String>,
    cross_image_srcs: Array<Base64String>,
    open_images?: Array<CanvasImageSource>,
    cross_images?: Array<CanvasImageSource>,
}

const packageMap = new PackageManifest();
const upload_state: State = {
    ...initState(),
    "loadImages": [false, true],
    "autoRotate": false,
    "viewMode": "validation",
    "language": "ja" as Language,
    "desiredImageSize": 150,
    "desiredThumbnailImageSize": 100,
    open_image_srcs: [],
    cross_image_srcs: [],
}

function bothImagesLoaded(flags) {
    return flags.reduce((acc, e) => acc && e, true)
}

async function fileSelectHandler(e): Promise<Array<Base64String>> {
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
        ).then(res as (arg: Array<Base64String>) => any)
    })
}

function readImageSize(state: State) {
    packageMap.setImageSize(state.uiState.samplePackage.open_images[0])
    return state
}

function readImagesNumber(state: State) {
    packageMap.setImagesNumber(state.uiState.samplePackage.open_images.length)
    return state
}

async function showImages(state: State) {
    readImageSize(state)
    readImagesNumber(state)
    const new_state = await updateStateByMeta(state)(packageMap.getPackageID(), packageMap.toJSON())

    state.uiState.samplePackage.open_images = await Promise.all(state.open_image_srcs.map(loadImageFromSrc))
    state.uiState.samplePackage.cross_images = await Promise.all(state.cross_image_srcs.map(loadImageFromSrc))

    return updateView(new_state)
        .then(showViewer)
        .then(showNicolButton)
}

function loadImageFromSrc(src): Promise<CanvasImageSource> {
    return new Promise((res, rej) => {

        const img = new Image()

        img.onload = _ => {
            res(img)
        }

        img.src = src

    })
}

function openImagesSelectHandler(state: State) {
    return e => new Promise(async (res, rej) => {
        state.open_image_srcs = await fileSelectHandler(e)
        state.loadImages[0] = true
        state.uiState.samplePackage.open_images = await Promise.all(state.open_image_srcs.map(loadImageFromSrc))
        await showImages(state)

        res(state)
    })
}

function crossImagesSelectHandler(state) {
    return e => new Promise(async (res, rej) => {
        state.cross_image_srcs = await fileSelectHandler(e)
        state.loadImages[1] = true
        state.uiState.samplePackage.cross_images = await Promise.all(state.cross_image_srcs.map(loadImageFromSrc))
        await showImages(state)

        res(state)
    })
}

async function updateView(state) {
    renderCurrentStateOnCanvas(viewer_ctx)(state)
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
    const cvs = document.querySelector("#working_canvas") as HTMLCanvasElement
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

function showPackageSize(state: State) {
    // Sum open and cross images (contains thumbnail)
    const imagesSize = (state.open_image_srcs.length * state.desiredImageSize + state.desiredThumbnailImageSize) * 2;
    (document.querySelector("#message_package_size") as HTMLElement).innerHTML = imagesSize.toString()
}

(function (state: State) {
    document.querySelector("#input_package_id").addEventListener(
        "change",
        e => {
            packageMap.setPackageID((e.target as HTMLInputElement).value)
        },
        false
    )

    document.querySelector("#input_desired_image_size").addEventListener(
        "change",
        e => {
            state.desiredImageSize = parseFloat((e.target as HTMLInputElement).value)
            showPackageSize(state)
        },
        false
    )

    document.querySelector("#input_desired_thumbnail_image_size").addEventListener(
        "change",
        e => {
            state.desiredThumbnailImageSize = parseFloat((e.target as HTMLInputElement).value)
            showPackageSize(state)
        },
        false
    )

    const centerToRight = document.querySelector("#rotate_center_from_left") as HTMLInputElement
    centerToRight.addEventListener(
        "change",
        e => {
            state.uiState.sampleMeta.rotateCenter.fromLeft = parseFloat((centerToRight as HTMLInputElement).value)
            updateView(state)
        },
        false
    )
    const centerToBottom = document.querySelector("#rotate_center_from_top") as HTMLInputElement
    centerToBottom.addEventListener(
        "change",
        e => {
            state.uiState.sampleMeta.rotateCenter.fromTop = parseFloat((centerToBottom as HTMLInputElement).value)
            updateView(state)
        },
        false
    )

    document.querySelector("#open_nicol_images").addEventListener(
        "change",
        e => {
            openImagesSelectHandler(state)(e).then((state: State) => {
                initializeOrUpdateInput(centerToRight, state.uiState.samplePackage.open_images[0].width as number / 2)
                initializeOrUpdateInput(centerToBottom, state.uiState.samplePackage.open_images[0].height as number / 2)
                showPackageSize(state)
            })
        },
        false
    )

    document.querySelector("#cross_nicol_images").addEventListener(
        "change",
        e => {
            crossImagesSelectHandler(state)(e).then((state: State) => {
                initializeOrUpdateInput(centerToRight, state.uiState.samplePackage.cross_images[0].width as number / 2)
                initializeOrUpdateInput(centerToBottom, state.uiState.samplePackage.cross_images[0].height as number / 2)
                showPackageSize(state)
            })
        },
        false
    )

    const rotateDirectionSelector = document.querySelector("#select_rotate_direction")
    rotateDirectionSelector.addEventListener(
        "change",
        e => {
            const target = e.target as HTMLSelectElement
            const direction = target.options[target.selectedIndex].value
            packageMap.setRotateDirection(direction)
        },
        false
    )

    const inputRotationInterval = document.querySelector("#input_rotation_interval")
    inputRotationInterval.addEventListener(
        "change",
        e => {
            packageMap.setEachRotateDegree((inputRotationInterval as HTMLInputElement).value)
            activateDom("#select_image_wrapper")
        },
        false
    )

    const inputScaleUnit = document.querySelector("#input_scale_unit")
    inputScaleUnit.addEventListener(
        "change",
        e => {
            packageMap.setScaleUnit((inputScaleUnit as HTMLInputElement).value)
        },
        false
    )

    const inputScaleLength = document.querySelector("#input_scale_length")
    inputScaleLength.addEventListener(
        "change",
        e => {
            packageMap.setScalePixel((inputScaleLength as HTMLInputElement).value)
        },
        false
    )

    const inputMagnification = document.querySelector("#input_magnification")
    inputMagnification.addEventListener(
        "change",
        e => {
            packageMap.setMagnify((e.target as HTMLInputElement).value)
        },
        false
    )

    const inputSampleLabel = document.querySelector("#input_sample_label")
    inputSampleLabel.addEventListener(
        "change",
        e => {
            packageMap.setSampleLabel((e.target as HTMLInputElement).value)
        },
        false
    )

    Array.from(document.querySelectorAll(".input_sample_location")).forEach(dom => {
        dom.addEventListener(
            "change",
            e => {
                packageMap.setSampleLocation((e.target as HTMLInputElement).dataset.lang, (e.target as HTMLInputElement).value)
            },
            false
        )
    })

    Array.from(document.querySelectorAll(".input_sample_type")).forEach(dom => {
        dom.addEventListener(
            "change",
            e => {
                packageMap.setRockType((e.target as HTMLInputElement).dataset.lang, (e.target as HTMLInputElement).value)
            },
            false
        )
    })

    Array.from(document.querySelectorAll(".input_description")).forEach(dom => {
        dom.addEventListener(
            "change",
            e => {
                packageMap.setDescription((e.target as HTMLInputElement).dataset.lang, (e.target as HTMLInputElement).value)
            },
            false
        )
    })

    Array.from(document.querySelectorAll(".input_sample_title"))
        .forEach(dom => {
            dom.addEventListener(
                "change",
                e => {
                    packageMap.setListName((e.target as HTMLInputElement).dataset.lang, (e.target as HTMLInputElement).value)

                }
            )
        })

    Array.from(document.querySelectorAll(".input_owner")).forEach(dom => {
        dom.addEventListener(
            "change",
            e => {
                packageMap.setOwner((e.target as HTMLInputElement).dataset.lang, (e.target as HTMLInputElement).value)
            },
            false
        )
    })

    const toggleNicolButton = document.querySelector("#change_nicol") as HTMLInputElement
    const toggleNicolLabel = document.querySelector("#change_nicol + label")

    const toggleNicolHandler = state => new Promise((res, rej) => {

        toggleNicolButton.checked = state.viewerState.isCrossNicol
        state.viewerState.isCrossNicol = !state.viewerState.isCrossNicol;

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
        const { viewerState } = state
        const { canvasHeight, canvasWidth, imageCenterInfo: { imageRadius } } = viewerState
        const position_on_canvas = canvasCoordinate(e)
        const shift = [
            position_on_canvas[0] - canvasWidth * 0.5,
            position_on_canvas[1] - canvasHeight * 0.5
        ]

        state.uiState.sampleMeta.rotateCenter.fromLeft += shift[0] * imageRadius / canvasWidth * 2
        state.uiState.sampleMeta.rotateCenter.fromTop += shift[1] * imageRadius / canvasWidth * 2

        state.viewerState.imageCenterInfo.rotateCenterToRight = state.uiState.sampleMeta.rotateCenter.fromLeft
        state.viewerState.imageCenterInfo.rotateCenterToBottom = state.uiState.sampleMeta.rotateCenter.fromTop

        packageMap.setRotateCenter(
            state.uiState.sampleMeta.rotateCenter.fromLeft,
            state.uiState.sampleMeta.rotateCenter.fromTop
        )

        centerToRight.value = state.uiState.sampleMeta.rotateCenter.fromLeft.toString()
        centerToBottom.value = state.uiState.sampleMeta.rotateCenter.fromTop.toString()

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

                const a = document.querySelector("#working_anchor") as HTMLAnchorElement
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
