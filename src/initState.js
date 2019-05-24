import getMinimumWindowSize from "./getMinimumWindowSize.js"
import selectLanguageCode from "./selectLanguageCode.js"

export default function initState() {
    return {
        "containorID": "",
        "imageNumber": 1,
        "canvasWidth": getMinimumWindowSize() <= 500
            ? getMinimumWindowSize()
            : 500,
        "canvasHeight": getMinimumWindowSize() <= 500
            ? getMinimumWindowSize()
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
        "language": selectLanguageCode(),
        "storedKeys": [],
        "drawHairLine": true,
        "canRotate": true,
    }
}
