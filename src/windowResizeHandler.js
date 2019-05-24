import { viewer, viewer_ctx } from "./viewer_canvas.js"
import getMinimumWindowSize from "./getMinimumWindowSize.js"

export default function windowResizeHandler(state) {
    return new Promise((res, rej) => {
        state.canvasWidth = getMinimumWindowSize() - 20
        state.canvasHeight = getMinimumWindowSize() - 20

        viewer.width = state.canvasWidth
        viewer.height = state.canvasHeight
        viewer_ctx.translate(state.canvasWidth * 0.5, state.canvasHeight * 0.5)
        res(state)
    })
}
