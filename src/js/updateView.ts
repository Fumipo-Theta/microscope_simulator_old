import { RootState } from "@src/js/type/entity"
import { viewer_ctx } from "./viewer_canvas"
import { renderCurrentStateOnCanvas } from "@src/js/component/ViewerContainer/viewer/sample_viewer"

export default function updateView(state: RootState) {
    renderCurrentStateOnCanvas(viewer_ctx)(state)
    return state
}
