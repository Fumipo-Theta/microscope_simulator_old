import { RootState } from "@src/js/type/entity"
import { updateCoordinate } from "./coordinate_updators"
import { updateMagnifyByPinch } from "./updateMagnify"
import { viewer_ctx } from "./viewer_canvas"
import { renderCurrentStateOnCanvas } from "@src/js/component/ViewerContainer/viewer/util/sample_viewer"

export default function pinchImage(state: RootState, e) {
    return () => {
        updateCoordinate(state, e)
        updateMagnifyByPinch(state, e)
        renderCurrentStateOnCanvas(viewer_ctx)(state)
    }
}
