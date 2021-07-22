import { RootState } from "@src/js/type/entity"
import { viewer, viewer_ctx } from "./viewer_canvas"
import getMaxViewerSize from "./getMaxViewerSize"

async function updateViewerGeometry(state: RootState) {
    const padding = 20 // px
    state.viewerState.canvasWidth = getMaxViewerSize() - padding
    state.viewerState.canvasHeight = getMaxViewerSize() - padding

    viewer.width = state.viewerState.canvasWidth
    viewer.height = state.viewerState.canvasHeight
    viewer_ctx.translate(state.viewerState.canvasWidth * 0.5, state.viewerState.canvasHeight * 0.5)
    return state
}


export default updateViewerGeometry
