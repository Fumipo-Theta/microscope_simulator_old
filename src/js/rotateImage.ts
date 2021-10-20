import { RootState } from "@src/js/type/entity"
import { updateCoordinate, updateRotate } from "./coordinate_updators"
import { viewer_ctx } from "./viewer_canvas"
import { renderCurrentStateOnCanvas } from "@src/js/component/ViewerContainer/viewer/util/sample_viewer"

export default function rotateImage(state: RootState, e) {
    return () => {
        updateCoordinate(state, e)
        updateRotate(state, e)
        renderCurrentStateOnCanvas(viewer_ctx)(state)
    }
}
