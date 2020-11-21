import { updateCoordinate } from "./coordinate_updators.js"
import { updateMagnifyByPinch } from "./updateMagnify.js"
import { blobToCanvas, drawHairLine, drawScale } from "./draw_state_updators.js"

export default function pinchImage(state, e) {
    return () => {
        updateCoordinate(state, e)
        updateMagnifyByPinch(state, e)
        blobToCanvas(state)
        drawHairLine(state)
        drawScale(state)
    }
}
