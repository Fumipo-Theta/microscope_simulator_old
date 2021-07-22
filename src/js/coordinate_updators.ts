import { Coordinate, RootState } from "@src/js/type/entity"
import { viewer } from "./viewer_canvas"

function getCoordinateOnCanvas(canvas: HTMLCanvasElement) {
    return (e: MouseEvent | TouchEvent, finger = 0): Coordinate => {
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
        } else if (e instanceof TouchEvent && e.touches.length > finger) {
            return [
                e.touches[finger].pageX - canvas.offsetLeft,
                e.touches[finger].pageY - canvas.offsetTop
            ]
        }
    }
}

export const canvasCoordinate = getCoordinateOnCanvas(viewer)

/**
 * Update start and end position
 */
export function updateCoordinate(state: RootState, e: MouseEvent | TouchEvent): RootState {
    state.inputState.dragStart = state.inputState.dragEnd
    state.inputState.dragEnd = canvasCoordinate(e)

    state.inputState.pinchStart = state.inputState.pinchEnd
    state.inputState.pinchEnd = canvasCoordinate(e, 1)
    return state
}

function radiunBetween(cx, cy) {
    return (_x1, _y1, _x2, _y2) => {
        const x1 = _x1 - cx
        const x2 = _x2 - cx
        const y1 = _y1 - cy
        const y2 = _y2 - cy

        const cos = (x1 * x2 + y1 * y2) / Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2))
        return Math.sign(x1 * y2 - x2 * y1) * Math.acos(cos)
    }
}

/**
 * Calculate small difference of rotation.
 * Update total rotation.
 */
export function updateRotate(state: RootState, e: MouseEvent | TouchEvent): RootState {
    if (!state.viewerState.canRotate) return state;
    if (!state.inputState.dragStart) return state;

    const { viewerState: { canvasWidth, canvasHeight, rotate }, inputState: { dragStart, dragEnd } } = state
    // delta rotate radius
    const rotateEnd = radiunBetween(canvasWidth * 0.5, canvasHeight * 0.5)(...dragEnd, ...dragStart)

    let nextRotate = rotate + rotateEnd / Math.PI * 180
    state.viewerState.isRotateClockwise = nextRotate <= rotate
    if (nextRotate >= 360) {
        nextRotate -= 360
    } else if (nextRotate < 0) {
        nextRotate += 360
    }
    state.viewerState.rotate = nextRotate
    return state
}
