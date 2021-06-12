import * as React from 'react'
import { ImageCenterInfo, ViewerState } from '../../../type/entity'
import { IRotationManager } from '../../../type/sample_viewer'
import { useState, useRef, useEffect } from 'react'
import { cycleBy, stepBy, mirrorBy, rotateSign } from "../../../rotation_degree_handlers.js"

type ViewerProps = {
    samplePackageUrl: String,
    viewerWidth: number,
    viewerHeight: number,
}

const useCanvas = (callback) => {
    const canvasRef = useRef(null)
    useEffect(() => {
        const canvas: HTMLCanvasElement = canvasRef.current
        const ctx: CanvasRenderingContext2D = canvas.getContext("2d")
        callback([canvas, ctx])
    }, [])
    return canvasRef
}

export const SampleViewer: React.FC<ViewerProps> = ({ samplePackageUrl, viewerWidth, viewerHeight }) => {
    const canvasRef = useCanvas(([canvas, ctx]) => {

    })
    const [rotation, updateRotation] = useState<number>(0)
    return (
        <>
            <canvas ref={canvasRef} id="scopinrock_canvas" width={viewerWidth} height={viewerHeight}></canvas>
        </>
    )
}


class RotationManagerForStepwisePhotos implements IRotationManager {
    private sampleRotateClockwise: boolean;
    private rotationStepDegrees: number;
    private rotationCycleDegrees: number;
    private totalSteps: number;
    private mirrorAt: number;


    constructor(sampleRotationIsClockwise: boolean, rotationStepDegrees: number, rotationCycleDegrees: number) {
        this.sampleRotateClockwise = sampleRotationIsClockwise
        this.rotationStepDegrees = rotationStepDegrees
        this.rotationCycleDegrees = rotationCycleDegrees
        const requiredImageNumber = (rotationCycleDegrees / rotationStepDegrees) + 1
        const mirrorAt = requiredImageNumber - 1
        const totalSteps = mirrorAt * 2
        this.mirrorAt = mirrorAt
        this.totalSteps = totalSteps
    }

    public getAlpha(rotation: number): number {
        const nth = cycleBy(this.totalSteps * 2)(
            stepBy(this.rotationStepDegrees)(rotation)
        )
        const distance = (rotation - this.rotationStepDegrees * nth) / this.rotationStepDegrees
        return 1 - distance
    }

    public getImageNumberToBeShown(rotation: number, extraSteps: number = 0): number {
        const netRotation = rotation + extraSteps * this.rotationStepDegrees
        if (this.rotationCycleDegrees > 0) {
            return cycleBy(this.mirrorAt)(
                stepBy(this.rotationStepDegrees)(this.sampleRotateClockwise ? 360 - netRotation : netRotation)
            )
        } else {
            return mirrorBy(this.mirrorAt)(
                cycleBy(this.totalSteps)(
                    stepBy(this.rotationStepDegrees)(netRotation)
                )
            )
        }
    }

    public calcRotationDegreesOfImage(rotation: number, extraSteps: number = 0): number {
        const nth = this.getImageNumberToBeShown(rotation, extraSteps)
        return rotateSign(this.sampleRotateClockwise) * (rotation + this.rotationStepDegrees * nth) / 180 * Math.PI
    }
}

function clipGeometryFromImageCenter({ rotateCenterToRight, rotateCenterToBottom, imageRadius }: ImageCenterInfo): [number, number, number, number] {
    return [
        rotateCenterToRight - imageRadius,
        rotateCenterToBottom - imageRadius,
        imageRadius * 2,
        imageRadius * 2
    ]
}

function renderCurrentStateOnCanvas(viewer_ctx: CanvasRenderingContext2D, rotationManager: IRotationManager) {
    return (state: ViewerState) => {
        const image_srcs = state.isCrossNicol
            ? state.cross_images
            : state.open_images

        with_restore_canvas_ctx(viewer_ctx, (ctx) => {
            clip_by_circle(ctx, state.canvasWidth)
            ctx.rotate(rotationManager.calcRotationDegreesOfImage(state.rotate, 0))
            ctx.globalAlpha = 1
            const image1 = image_srcs[rotationManager.getImageNumberToBeShown(state.rotate, 0)]

            try {
                ctx.drawImage(
                    image1,
                    ...clipGeometryFromImageCenter(state),
                    -state.canvasWidth / 2,
                    -state.canvasHeight / 2,
                    state.canvasWidth,
                    state.canvasHeight
                );
            } catch (e) {
                console.log(e)
            }
            return ctx
        })

        with_restore_canvas_ctx(viewer_ctx, (ctx) => {
            clip_by_circle(ctx, state.canvasWidth)
            ctx.rotate(rotationManager.calcRotationDegreesOfImage(state.rotate, 1))
            ctx.globalAlpha = 1 - rotationManager.getAlpha(state.rotate)
            const image2 = image_srcs[rotationManager.getImageNumberToBeShown(state.rotate, 1)]
            try {
                ctx.drawImage(
                    image2,
                    ...clipGeometryFromImageCenter(state),
                    -state.canvasWidth / 2,
                    -state.canvasHeight / 2,
                    state.canvasWidth,
                    state.canvasHeight)
            } catch (e) {
                console.log(e)
            }
            return ctx
        })
        return state
    }
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