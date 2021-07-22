import { ViewerState } from "@src/js/type/entity"
import getMaxViewerSize from "../getMaxViewerSize"

export const viewerState: ViewerState = {
    isCrossNicol: false,
    canvasWidth: getMaxViewerSize() <= 500
        ? getMaxViewerSize()
        : 500,
    canvasHeight: getMaxViewerSize() <= 500
        ? getMaxViewerSize()
        : 500,
    rotate: 180,
    canRotate: true,
    drawHairLine: true,
    imageCenterInfo: {
        rotateCenterToBottom: 0,
        rotateCenterToRight: 0,
        imageRadius: 0
    },
    isRotateClockwise: true
}