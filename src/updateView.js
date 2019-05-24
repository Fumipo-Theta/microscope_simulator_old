import { clearView, blobToCanvas, drawHairLine, drawScale } from "./draw_state_updators.js"

export default function updateView(state) {
    clearView(state)
    blobToCanvas(state)
    drawHairLine(state)
    drawScale(state)
    return state
}
