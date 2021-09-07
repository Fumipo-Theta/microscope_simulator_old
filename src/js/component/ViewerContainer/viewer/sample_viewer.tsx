import { ImageCenterInfo, ImageSource, RootState, SampleMeta, ViewerState } from '../../../type/entity'
import { IRotationManager } from '../../../type/sample_viewer'

function clipGeometryFromImageCenter({ rotateCenterToRight, rotateCenterToBottom, imageRadius }: ImageCenterInfo): [number, number, number, number] {
    return [
        rotateCenterToRight - imageRadius,
        rotateCenterToBottom - imageRadius,
        imageRadius * 2,
        imageRadius * 2
    ]
}

function clip_by_circle(ctx: CanvasRenderingContext2D, radius: number): CanvasRenderingContext2D {
    ctx.beginPath()
    ctx.arc(0, 0, radius / 2, 0, Math.PI * 2, false)
    ctx.clip()
    return ctx
}

function with_restore_canvas_ctx(ctx: CanvasRenderingContext2D, callback: (_ctx: CanvasRenderingContext2D) => CanvasRenderingContext2D): CanvasRenderingContext2D {
    ctx.save()
    callback(ctx)
    ctx.restore()
    return ctx
}

function clearView(viewer_ctx, { canvasHeight, canvasWidth }) {
    viewer_ctx.clearRect(-canvasWidth * 0.5, -canvasHeight * 0.5, canvasWidth, canvasHeight)
}

function drawHairLine(viewer_ctx, { canvasHeight, canvasWidth, isCrossNicol }) {
    viewer_ctx.strokeStyle = isCrossNicol ? "white" : "black";
    viewer_ctx.globalAlpha = 1
    viewer_ctx.beginPath()
    viewer_ctx.moveTo(0, -canvasHeight * 0.5)
    viewer_ctx.lineTo(0, canvasHeight * 0.5)
    viewer_ctx.moveTo(-canvasWidth * 0.5, 0)
    viewer_ctx.lineTo(canvasWidth * 0.5, 0)
    viewer_ctx.closePath()
    viewer_ctx.stroke()
}

const scaleLength = (canvasWidth, imageWidth, scaleWidth) => canvasWidth * scaleWidth / imageWidth

function drawScale(viewer_ctx, { canvasWidth, imageCenterInfo: { imageRadius } }: ViewerState, { scale }: SampleMeta) {
    if (!scale.scaleWidth) return;
    let scalePixel = scaleLength(canvasWidth, imageRadius * 2, scale.scaleWidth)
    const scaleBar = document.querySelector("#scalebar") as HTMLElement

    let scaleNumber = parseFloat(scale.scaleText.match(/(\d+\.?\d*)/)[0]) * 1
    const scaleUnit = scale.scaleText.match(/\D*$/)[0]

    while (scalePixel >= canvasWidth) {
        scalePixel *= 0.5
        scaleNumber *= 0.5
    }
    scaleBar.style.width = scalePixel + "px";
    scaleBar.querySelector("div:first-child").innerHTML = `${scaleNumber} ${scaleUnit}`;
}

export function renderCurrentStateOnCanvas(viewer_ctx: CanvasRenderingContext2D): (state: RootState) => void {
    return ({ viewerState, uiState: { samplePackage, sampleMeta } }: RootState): void => {
        const { rotate, canvasHeight, canvasWidth, imageCenterInfo, rotationHandler, isRotateClockwise } = viewerState
        const image_src = viewerState.isCrossNicol
            ? samplePackage.cross_images
            : samplePackage.open_images

        clearView(viewer_ctx, viewerState)

        with_restore_canvas_ctx(viewer_ctx, (ctx) => {
            clip_by_circle(ctx, canvasWidth)
            ctx.rotate(rotationHandler.calcRotationDegreesOfImage(rotate, 0))
            ctx.globalAlpha = 1
            const imageIndex = rotationHandler.getImageNumberToBeShown(rotate, 0)
            const image1 = image_src[imageIndex]
            try {
                ctx.drawImage(
                    image1,
                    ...clipGeometryFromImageCenter(imageCenterInfo),
                    -canvasWidth / 2,
                    -canvasHeight / 2,
                    canvasWidth,
                    canvasHeight
                );
            } catch (e) {
                console.log(e)
                console.log({ rotate, imageIndex })
            }
            return ctx
        })

        with_restore_canvas_ctx(viewer_ctx, (ctx) => {
            clip_by_circle(ctx, canvasWidth)
            ctx.rotate(rotationHandler.calcRotationDegreesOfImage(rotate, 1))
            ctx.globalAlpha = 1 - rotationHandler.getAlpha(rotate)
            const imageIndex = rotationHandler.getImageNumberToBeShown(rotate, 1)
            const image2 = image_src[imageIndex]
            try {
                ctx.drawImage(
                    image2,
                    ...clipGeometryFromImageCenter(imageCenterInfo),
                    -canvasWidth / 2,
                    -canvasHeight / 2,
                    canvasWidth,
                    canvasHeight)
            } catch (e) {
                console.log(e)
                console.log({ rotate, imageIndex })
            }
            return ctx
        })

        drawHairLine(viewer_ctx, viewerState)
        drawScale(viewer_ctx, viewerState, sampleMeta)
    }
}

type Props = {
    imageSource: ImageSource,
    rotationHandler: IRotationManager,
    canvasHeight: number,
    canvasWidth: number,
    imageCenterInfo: ImageCenterInfo,
    isCrossNicol: boolean,
    rotate: number
}

export function renderOnCanvas(viewer_ctx: CanvasRenderingContext2D): (props: Props) => void {
    return (props): void => {
        const { imageSource, rotationHandler, canvasHeight, canvasWidth, imageCenterInfo, isCrossNicol, rotate } = props
        const image_src = isCrossNicol
            ? imageSource.crossImages
            : imageSource.openImages
        console.log(rotate, imageCenterInfo)

        with_restore_canvas_ctx(viewer_ctx, (ctx) => {
            clearView(ctx, { canvasHeight, canvasWidth })
            return ctx
        })

        with_restore_canvas_ctx(viewer_ctx, (ctx) => {
            ctx.translate(canvasWidth * 0.5, canvasHeight * 0.5)
            clip_by_circle(ctx, canvasWidth)
            ctx.rotate(rotationHandler.calcRotationDegreesOfImage(rotate, 0))
            ctx.globalAlpha = 1
            const imageIndex = rotationHandler.getImageNumberToBeShown(rotate, 0)
            const image1 = image_src[imageIndex]
            try {
                ctx.drawImage(
                    image1,
                    ...clipGeometryFromImageCenter(imageCenterInfo),
                    -canvasWidth / 2,
                    -canvasHeight / 2,
                    canvasWidth,
                    canvasHeight
                );
            } catch (e) {
                console.log(e)
                console.log({ rotate, imageIndex })
            }
            return ctx
        })

        with_restore_canvas_ctx(viewer_ctx, (ctx) => {
            ctx.translate(canvasWidth * 0.5, canvasHeight * 0.5)
            clip_by_circle(ctx, canvasWidth)
            ctx.rotate(rotationHandler.calcRotationDegreesOfImage(rotate, 1))
            ctx.globalAlpha = 1 - rotationHandler.getAlpha(rotate)
            const imageIndex = rotationHandler.getImageNumberToBeShown(rotate, 1)
            const image2 = image_src[imageIndex]
            try {
                ctx.drawImage(
                    image2,
                    ...clipGeometryFromImageCenter(imageCenterInfo),
                    -canvasWidth / 2,
                    -canvasHeight / 2,
                    canvasWidth,
                    canvasHeight)
            } catch (e) {
                console.log(e)
                console.log({ rotate, imageIndex })
            }
            return ctx
        })
        with_restore_canvas_ctx(viewer_ctx, (ctx) => {
            ctx.translate(canvasWidth * 0.5, canvasHeight * 0.5)
            drawHairLine(ctx, { canvasWidth, canvasHeight, isCrossNicol })
            return ctx
        })
        //drawScale(viewer_ctx, viewerState, sampleMeta)
    }
}
