import { RootState } from "@src/js/type/entity"
import { uiState } from "./ui_state"
import { viewerState } from "./viewer_state"

const initState = (): RootState => {
    return {
        inputState: {
            isMouseDown: false,
            dragStart: [0, 0],
            dragEnd: [0, 0]
        },
        uiState: uiState,
        viewerState: viewerState,
        cacheStorage: {},
    }
}

export default initState
