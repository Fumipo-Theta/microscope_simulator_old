import { updateMagnifyByWheel } from "./updateMagnify.js"
import { blobToCanvas, drawHairLine, drawScale } from "./draw_state_updators.js"

export default function wheelImage(state, e) {
    return () => {
        updateMagnifyByWheel(state, e)
        blobToCanvas(state)
        drawHairLine(state)
        drawScale(state)
    }
}
