import { RootState } from "@src/js/type/entity"
import { updateMagnifyByWheel } from "./updateMagnify"
import { viewer_ctx } from "./viewer_canvas"
import { renderCurrentStateOnCanvas } from "@src/js/component/ViewerContainer/viewer/sample_viewer"

export default function wheelImage(state: RootState, e) {
    return () => {
        updateMagnifyByWheel(state, e)
        renderCurrentStateOnCanvas(viewer_ctx)(state)
        return state
    }
}
