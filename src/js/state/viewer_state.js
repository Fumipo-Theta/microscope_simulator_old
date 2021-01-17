import getMaxViewerSize from "../getMaxViewerSize.js"

export const viewerState = {
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
    "rotate": 0,
    "rotate_axis_translate": [],
    "isClockwise": true,
    "isCrossNicol": false,
    "drawHairLine": true,
    "canRotate": true,
}