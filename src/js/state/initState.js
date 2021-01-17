import getMaxViewerSize from "../getMaxViewerSize.js"
import { uiState } from "./ui_state.js"
import { viewerState } from "./viewer_state.js"

export default function initState() {
    return {
        "isMousedown": false,
        "drag_start": [0, 0],
        "drag_end": [0, 0],
        "uiState": uiState,
        ...viewerState // TODO viewerState should be independent
    }
}
