import { viewer, viewer_ctx } from "./viewer_canvas.js"
import getMaxViewerSize from "./getMaxViewerSize.js"

export default function updateViewerGeometry(state) {
    return new Promise((res, rej) => {
        const padding = 20 / px
        state.canvasWidth = getMaxViewerSize() - padding
        state.canvasHeight = getMaxViewerSize() - padding

        viewer.width = state.canvasWidth
        viewer.height = state.canvasHeight
        viewer_ctx.translate(state.canvasWidth * 0.5, state.canvasHeight * 0.5)
        res(state)
    })
}
