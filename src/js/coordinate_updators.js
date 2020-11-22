import { viewer } from "./viewer_canvas.js"
import getCoordinateOnCanvas from "./getCoordinateOnCanvas.js"
import radiunBetween from "./radiunBetween.js"


export const canvasCoordinate = getCoordinateOnCanvas(viewer)

/**
 * Update start and end position
 * @param {*} state
 * @param {*} e
 */
export function updateCoordinate(state, e) {
    state.drag_start = state.drag_end || undefined
    state.drag_end = canvasCoordinate(e)

    state.pinch_start = state.pinch_end || undefined
    state.pinch_end = canvasCoordinate(e, 1)
    return state
}

/**
 * Calculate small difference of rotation.
 * Update total rotation.
 *
 * @param {*} state
 * @param {*} e
 */
export function updateRotate(state, e) {
    if (!state.canRotate) return;
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
    return state
}
