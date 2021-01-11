import getMaxViewerSize from "../getMaxViewerSize.js"
import { uiState } from "./ui_state.js"

export default function initState() {

    return {
        "containorID": "",
        "imageNumber": 1,
        "canvasWidth": getMaxViewerSize() <= 500
            ? getMaxViewerSize()
            : 500,
        "canvasHeight": getMaxViewerSize() <= 500
            ? getMaxViewerSize()
            : 500,
        "imageRadius": 0,
        "open_image_srcs": [],
        "open_images": [],
        "cross_image_srcs": [],
        "cross_images": [],
        "isMousedown": false,
        "drag_start": [0, 0],
        "drag_end": [0, 0],
        "rotate": 0,
        "rotate_axis_translate": [],
        "isClockwise": true,
        "isCrossNicol": false,
        "drawHairLine": true,
        "canRotate": true,
        "uiState": uiState
    }
}
