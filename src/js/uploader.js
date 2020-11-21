const package = new PackageManifest();

const upload_state = Object.assign(
    resetState(),
    {
        "loadImages": [false, true],
        "autoRotate": false,
        "viewMode": "validation",
        "language": "ja",
    }
)

const mock_meta = {
    "scale-unit": "1mm",
    "scale-pixel": 305,
    "image_width": 1280,
    "image_height": 1280,
    "rotate_center": [
    ],
    "cycle_rotate_degree": 180,
    "rotate_clockwise": true,
    "rotate_by_degree": 15,
}

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

function autoRotate(state) {
    return _ => {
        if (!state.autoRotate) return state

        state.rotate += 0.1;
        if (state.rotate >= 360) {
            state.rotate -= 360
        } else if (state.rotate < 0) {
            state.rotate += 360
        }
        updateView_validate(state)
        return requestAnimationFrame(autoRotate(state))
    }
}

function readImageSize(state) {
    package.setImageSize(state.open_images[0])
    return state
}

function readImagesNumber(state) {
    package.setImagesNumber(state.open_images.length)
    return state
}

async function showImages(state) {
    readImageSize(state)
    readImagesNumber(state)
    const new_state = await updateStateByMeta(state, "upload")(package.packageID, package.toJSON())

    new_state.open_images = await Promise.all(state.open_image_srcs.map(loadImageFromSrc))

    new_state.cross_images = await Promise.all(state.cross_image_srcs.map(loadImageFromSrc))

    return updateView_validate(new_state)
        .then(showViewer)
        .then(showNicolButton)
        .then(state => autoRotate(state)())
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

function blobToCanvas_validate(state) {

    image_srcs = state.isCrossNicol
        ? state.cross_images
        : state.open_images

    // view window circle

    viewer_ctx.save()

    // Draw a image
    alpha = state.getAlpha(state.rotate)

    if (state.viewMode !== "validation") {
        viewer_ctx.beginPath()
        viewer_ctx.arc(0, 0, state.canvasWidth / 2 - VIEW_PADDING, 0, Math.PI * 2, false)
        viewer_ctx.clip()
        viewer_ctx.rotate(
            rotateSign(state.isClockwise) * (state.rotate + state.getImageNumber(state.rotate) * 15) / 180 * Math.PI
        )
    }


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

    if (state.viewMode !== "validation") {
        viewer_ctx.beginPath()
        viewer_ctx.arc(0, 0, state.canvasWidth / 2 - VIEW_PADDING, 0, Math.PI * 2, false)
        viewer_ctx.clip()
        viewer_ctx.rotate(
            rotateSign(state.isClockwise) * (state.rotate + state.getImageNumber(state.rotate + 15) * 15) / 180 * Math.PI
        )
    }


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

const rotateImage_validate = (state, e) => () => {
    updateCoordinate(state, e)
    updateRotate(state, e)
    blobToCanvas_validate(state)
    drawHairLine(state)
}

async function updateView_validate(state) {
    clearView(state)
    blobToCanvas_validate(state)
    drawHairLine(state)
    drawScale(state)
    return state
}

const pinchImage_validate = (state, e) => () => {
    updateCoordinate(state, e)
    updateMagnifyByPinch(state, e)
    blobToCanvas_validate(state)
    drawHairLine(state)
    drawScale(state)
}

const wheelImage_validate = (state, e) => () => {
    updateMagnifyByWheel(state, e)
    blobToCanvas_validate(state)
    drawHairLine(state)
    drawScale(state)
}

const touchMoveHandler_validate = state => e => {
    if (!state.isMousedown) return
    if (e instanceof MouseEvent || e.touches.length === 1) {
        e.preventDefault();
        requestAnimationFrame(
            rotateImage_validate(state, e)
        )
    } else if (e.touches.length === 2) {
        e.preventDefault()
        requestAnimationFrame(
            pinchImage_validate(state, e)
        )
    }
    //if (e.cancelable) {

    //}
}

const touchEndHandler_validate = state => e => {
    state.isMousedown = false
    state.drag_end = undefined
    state.pinch_end = undefined
    e.preventDefault()
}

const wheelHandler_validate = state => e => {
    e.preventDefault();
    requestAnimationFrame(
        wheelImage_validate(state, e)
    )
}

function activateDom(selector) {
    Array.from(document.querySelectorAll(selector))
        .forEach(dom => {
            dom.classList.remove("inactive")
        })
}

function deactivateDom(selector) {
    Array.from(document.querySelectorAll(selector))
        .forEach(dom => {
            dom.classList.add("inactive")
        })
}

function selectLanguageHandler(state) {
    return e => {
        Array.from(document.querySelectorAll(".language"))
            .forEach(dom => {
                if (dom.classList.contains(state.language)) {
                    dom.classList.remove("inactive")
                } else {
                    dom.classList.add("inactive")
                }
            })
    }
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

function compressImageSrc(src, size = 125000) {
    const image = new Image()
    image.src = src
    const w = image.width
    const h = image.height
    const cvs = document.querySelector("#working_canvas")
    cvs.width = w
    cvs.height = h
    const ctx = cvs.getContext("2d")
    ctx.drawImage(image, 0, 0, w, h)

    const originalBinary = cvs.toDataURL("image/webp"); //画質落とさずバイナリ化
    const mime = originalBinary.match(/(:)([a-z\/]+)(;)/)[2]

    const originalBlob = base64ToBlob(originalBinary.split(",")[1], mime);

    if (size < originalBlob["size"]) {
        const capacityRatio = size / originalBlob["size"];
        const processingBinary = cvs.toDataURL("image/webp", capacityRatio); //画質落としてバイナリ化
        return base64ToBlob(processingBinary.split(",")[1], mime);
    } else {
        return originalBlob
    }
}


function send_sample_list_entry(json_obj) {
    document.querySelector("#dev_sample_list_entry").innerHTML = JSON.stringify(json_obj, null, 2)
};

(function (state) {
    document.querySelector("#input_package_id").addEventListener(
        "change",
        e => {
            package.setPackageID(e.target.value)
        },
        false
    )

    document.querySelector("#open_nicol_images").addEventListener(
        "change",
        openImagesSelectHandler(state),
        false
    )

    document.querySelector("#cross_nicol_images").addEventListener(
        "change",
        crossImagesSelectHandler(state),
        false
    )

    const rotateDirectionSelector = document.querySelector("#select_rotate_direction")
    rotateDirectionSelector.addEventListener(
        "change",
        e => {
            const direction = e.target.options[e.target.selectedIndex].value
            package.setRotateDirection(direction)
        },
        false
    )

    /*
    document.querySelector("#select_language").addEventListener(
        "change",
        e => {
            state.language = e.target.options[e.target.selectedIndex].value
            selectLanguageHandler(state)(e)
        },
        false
    )
    */

    const inputRotationInterval = document.querySelector("#input_rotation_interval")
    inputRotationInterval.addEventListener(
        "change",
        e => {
            package.setEachRotateDegree(inputRotationInterval.value)
            activateDom("#select_image_wrapper")
        },
        false
    )

    const inputScaleUnit = document.querySelector("#input_scale_unit")
    inputScaleUnit.addEventListener(
        "change",
        e => {
            package.setScaleUnit(inputScaleUnit.value)
        },
        false
    )

    const inputScaleLength = document.querySelector("#input_scale_length")
    inputScaleLength.addEventListener(
        "change",
        e => {
            package.setScalePixel(inputScaleLength.value)
        },
        false
    )

    const inputMagnification = document.querySelector("#input_magnification")
    inputMagnification.addEventListener(
        "change",
        e => {
            package.setMagnify(e.target.value)
        },
        false
    )

    const inputSampleLocation = document.querySelector("#input_sample_location")
    inputSampleLocation.addEventListener(
        "change",
        e => {
            package.setSampleLocation(e.target.dataset.lang, e.target.value)
        }
    )

    const inputSampleType = document.querySelectorAll(".input_sample_type")
    Array.from(inputSampleType).forEach(dom => {
        dom.addEventListener(
            "change",
            e => {
                package.setRockType(e.target.dataset.lang, e.target.value)
            },
            false
        )
    })

    const inputDiscription = document.querySelectorAll(".input_discription")
    Array.from(inputDiscription).forEach(dom => {
        dom.addEventListener(
            "change",
            e => {
                package.setDiscription(e.target.dataset.lang, e.target.value)
            },
            false
        )
    })

    Array.from(document.querySelectorAll(".input_sample_title"))
        .forEach(dom => {
            dom.addEventListener(
                "change",
                e => {
                    package.setListName(e.target.value, e.target.dataset.lang)

                }
            )
        })

    const toggleNicolButton = document.querySelector("#change_nicol")
    const toggleNicolLabel = document.querySelector("#change_nicol + label")

    const toggleNicolHandler = state => new Promise((res, rej) => {

        toggleNicolButton.checked = state.isCrossNicol
        state.isCrossNicol = !state.isCrossNicol;

        res(state)
    })

    document.querySelector("#input_owner").addEventListener(
        "change",
        e => {
            package.setOwner(e.target.value)
        },
        false
    )


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
            .then(updateView_validate),
        false
    )

    toggleNicolLabel.addEventListener(
        "touchend",
        e => toggleNicolHandler(state)
            .then(updateView_validate)
            .then(_ => {
                if (e.cancelable) {
                    e.preventDefault();
                }
            }),
        false
    )

    const toggleValidateView = document.querySelector("#change_validation")
    toggleValidateView.addEventListener(
        "change",
        e => {
            state.viewMode = (toggleValidateView.checked)
                ? "validation"
                : "preview"
        }
    )

    viewer.oncontextmenu = function (e) {
        const position_on_canvas = canvasCoordinate(e)
        const current_rotate_center = Object.values(state.rotate_center)
        const shift = [
            position_on_canvas[0] - state.canvasWidth * 0.5,
            position_on_canvas[1] - state.canvasHeight * 0.5
        ]

        state.rotate_center.to_right += shift[0] * state.imageRadius / state.canvasWidth * 2
        state.rotate_center.to_bottom += shift[1] * state.imageRadius / state.canvasWidth * 2

        package.setRotateCenter(
            state.rotate_center.to_right,
            state.rotate_center.to_bottom
        )

        e.preventDefault()
        updateView_validate(state)
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
        touchMoveHandler_validate(state),
        false
    )

    viewer.addEventListener(
        "touchmove",
        touchMoveHandler_validate(state),
        false
    )

    viewer.addEventListener(
        "mouseup",
        touchEndHandler_validate(state),
        false
    )

    viewer.addEventListener(
        "touchend",
        touchEndHandler_validate(state),
        false
    )

    viewer.addEventListener(
        "wheel",
        wheelHandler_validate(state),
        false
    )

    document.querySelector("#create_package_button").addEventListener(
        "click",
        e => {

            const meta = new Blob([JSON.stringify(package.toJSON(), null, 2)], { "type": "text/json" });
            const zip = new JSZip();
            zip.file("manifest.json", meta)

            state.open_image_srcs.forEach((src, i) => {
                zip.file(`o${i + 1}.webp`, compressImageSrc(src))
            })

            state.cross_image_srcs.forEach((src, i) => {
                zip.file(`c${i + 1}.webp`, compressImageSrc(src))
            })

            send_sample_list_entry(package.getSampleListEntry())

            zip.generateAsync({ type: "blob" })
                .then(function (content) {
                    const a = document.querySelector("#working_anchor")
                    a.download = `${package.getPackageID()}.zip`
                    a.href = window.URL.createObjectURL(content)
                    a.click()
                });
        },
        false
    )

    windowResizeHandler(state)
})(upload_state)
