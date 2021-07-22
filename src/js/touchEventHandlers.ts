import { RootState } from "@src/js/type/entity"
import { canvasCoordinate } from "./coordinate_updators"
import rotateImage from "./rotateImage"
import pinchImage from "./pinchImage"

export const touchStartHandler = (state: RootState) => e => {
    state.inputState.isMouseDown = true
    state.inputState.dragEnd = canvasCoordinate(e)
    e.preventDefault();
}

export const touchMoveHandler = (state: RootState) => e => {
    if (!state.inputState.isMouseDown) return
    if (e instanceof MouseEvent || e.touches.length === 1) {
        e.preventDefault();
        requestAnimationFrame(
            rotateImage(state, e)
        )
    } else if (e.touches.length === 2) {
        e.preventDefault()
        requestAnimationFrame(
            pinchImage(state, e)
        )
    }
}

export const touchEndHandler = (state: RootState) => e => {
    state.inputState.isMouseDown = false
    state.inputState.dragEnd = undefined
    state.inputState.pinchEnd = undefined
    e.preventDefault()
}
