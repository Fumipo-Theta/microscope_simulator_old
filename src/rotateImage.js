import { updateCoordinate, updateRotate } from "./coordinate_updators.js"
import { blobToCanvas, drawHairLine } from "./draw_state_updators.js"

export default function rotateImage(state, e) {
    return () => {
        updateCoordinate(state, e)
        updateRotate(state, e)
        blobToCanvas(state)
        drawHairLine(state)
    }
}
