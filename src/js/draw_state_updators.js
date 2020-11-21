import clipGeometoryFromImageCenter from "./clipGeometryFromImageCenter.js"
import { viewer_ctx } from "./viewer_canvas.js"
import { VIEW_PADDING } from "./config/config.js"
import { rotateSign } from "./rotation_degree_handlers.js"

export function clearView(state) {
    viewer_ctx.clearRect(-state.canvasWidth * 0.5, -state.canvasHeight * 0.5, state.canvasWidth, state.canvasHeight)
    return state
}

export function blobToCanvas(state) {

    const image_srcs = state.isCrossNicol
        ? state.cross_images
        : state.open_images

    // view window circle

    viewer_ctx.save()
    viewer_ctx.beginPath()
    viewer_ctx.arc(0, 0, state.canvasWidth / 2 - VIEW_PADDING, 0, Math.PI * 2, false)
    viewer_ctx.clip()

    // Draw a image
    const alpha = state.getAlpha(state.rotate)

    viewer_ctx.rotate(
        rotateSign(state.isClockwise) * (state.rotate + state.getImageNumber(state.rotate) * 15) / 180 * Math.PI
    )

    viewer_ctx.globalAlpha = 1
    const image1 = image_srcs[state.getImageNumber(state.rotate)]

    try {
        viewer_ctx.drawImage(
            image1,
            ...clipGeometoryFromImageCenter(state),
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
    const image2 = image_srcs[state.getImageNumber(state.rotate + 15)]
    try {
        viewer_ctx.drawImage(
            image2,
            ...clipGeometoryFromImageCenter(state),
            -state.canvasWidth / 2,
            -state.canvasHeight / 2,
            state.canvasWidth,
            state.canvasHeight)
    } catch (e) {

    }
    viewer_ctx.restore()
    return state
}

export function drawHairLine(state) {
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

export function drawScale(state) {
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
