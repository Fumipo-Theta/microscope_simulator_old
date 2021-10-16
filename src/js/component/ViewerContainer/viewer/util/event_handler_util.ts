import React from "react"
import { ImageSource, SampleImageType, Coordinate, ImageCenterInfo } from "@src/js/type/entity"

export type UiState = {
    touching: boolean,
    dragStart?: Coordinate,
    dragEnd?: Coordinate,
    pinchStart?: Coordinate,
    pinchEnd?: Coordinate,
    isRotateClockwise: boolean,
    canRotate: boolean,
    rotate: number,
    imageCenterInfo: ImageCenterInfo,
}

export const getMaxViewerSize = (windowWidth, windowHeight) => {
    const padding = 20 // px
    const navigationAndNicolHeight = 64 + 100 + 20 // px
    const width = windowWidth
    const height = windowHeight - navigationAndNicolHeight
    return (width < height ? width : height) - padding
}

export function getImageCenterInfo(meta) {
    const shift = getRotationCenter(meta);
    const image_center = {
        "x": meta.image_width * 0.5,
        "y": meta.image_height * 0.5
    }
    const imageRadius = Math.min(
        image_center.x - Math.abs(image_center.x - shift.rotateCenterToRight),
        image_center.y - Math.abs(image_center.y - shift.rotateCenterToBottom)
    )
    return {
        ...shift,
        imageRadius
    }
}

export async function updateImageSrc(imageNumber, imagesMap, ext: SampleImageType): Promise<ImageSource> {
    const repeats = Array(imageNumber - 1).fill(0)

    return await Promise.all([
        Promise.all(repeats
            .map((_, i) => selectImageInContainer(imagesMap, `o${i + 1}.${ext}`))
            .map(loadImageSrc)
        ),
        Promise.all(repeats
            .map((_, i) => selectImageInContainer(imagesMap, `c${i + 1}.${ext}`))
            .map(loadImageSrc)
        )
    ])
        .then(imgDOMs => {
            const open_imgs = imgDOMs[0] as CanvasImageSource[]

            const cross_imgs = imgDOMs[1] as CanvasImageSource[]

            return { openImages: open_imgs, crossImages: cross_imgs }
        })
}

export function getCoordinateOnCanvas(canvas: HTMLElement) {
    return (e: MouseEvent | TouchEvent, finger = 0): Coordinate => {
        if (e instanceof MouseEvent) {
            return (e instanceof WheelEvent)
                ? [
                    e.deltaX,
                    e.deltaY
                ]
                : [
                    e.pageX - canvas.offsetLeft,
                    e.pageY - canvas.offsetTop
                ]
        } else if (e instanceof TouchEvent && e.touches.length > finger) {
            return [
                e.touches[finger].pageX - canvas.offsetLeft,
                e.touches[finger].pageY - canvas.offsetTop
            ]
        }
    }
}

export function updateRotate(state: React.MutableRefObject<UiState>, viewerSize: number, e: MouseEvent | TouchEvent): [UiState, number] {
    if (!state.current.canRotate) return;
    if (!state.current.dragStart) return;
    const { dragStart, dragEnd } = state.current
    const rotate = state.current.rotate

    // delta rotate radius
    const rotateEnd = radianBetween(viewerSize * 0.5, viewerSize * 0.5)(...dragEnd, ...dragStart)

    let nextRotate = rotate + rotateEnd / Math.PI * 180

    if (nextRotate >= 360) {
        nextRotate -= 360
    } else if (nextRotate < 0) {
        nextRotate += 360
    }
    state.current.isRotateClockwise = nextRotate <= rotate
    state.current.rotate = nextRotate
}

export function updateCoordinate(state: React.MutableRefObject<UiState>, coordinateOnCanvas, e: MouseEvent | TouchEvent) {
    const { dragEnd, pinchEnd } = state.current
    state.current = {
        ...state.current,
        dragStart: dragEnd,
        dragEnd: coordinateOnCanvas(e),
        pinchStart: pinchEnd,
        pinchEnd: coordinateOnCanvas(e, 1)
    }
}

export function updateMagnifyByPinch(state: React.MutableRefObject<UiState>, originalRadius) {
    if (!state.current.dragStart) return
    if (!state.current.pinchStart) return

    const x1 = [...state.current.dragStart]
    const y1 = [...state.current.pinchStart]
    const x2 = [...state.current.dragEnd]
    const y2 = [...state.current.pinchEnd]

    const expansion = Math.sqrt((x2[0] - y2[0]) ** 2 + (x2[1] - y2[1]) ** 2) / Math.sqrt((x1[0] - y1[0]) ** 2 + (x1[1] - y1[1]) ** 2)

    const currentRadius = state.current.imageCenterInfo.imageRadius
    const candRadius = (expansion > 2)
        ? currentRadius
        : currentRadius / expansion

    const newRadius = (candRadius) > originalRadius
        ? originalRadius
        : (candRadius < 100)
            ? 100
            : candRadius
    state.current.imageCenterInfo = { ...state.current.imageCenterInfo, imageRadius: newRadius }
}

function getRotationCenter(meta) {
    return (meta.hasOwnProperty("rotate_center"))
        ? {
            rotateCenterToRight: meta.rotate_center[0],
            rotateCenterToBottom: meta.rotate_center[1]
        }
        : {
            rotateCenterToRight: meta.image_width * 0.5,
            rotateCenterToBottom: meta.image_height * 0.5
        }
}

function radianBetween(cx, cy) {
    return (_x1, _y1, _x2, _y2) => {
        const x1 = _x1 - cx
        const x2 = _x2 - cx
        const y1 = _y1 - cy
        const y2 = _y2 - cy

        const cos = (x1 * x2 + y1 * y2) / Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2))
        return Math.sign(x1 * y2 - x2 * y1) * Math.acos(cos)
    }
}


function selectImageInContainer(container, prefix) {
    if (prefix in container) {
        return container[prefix]
    }
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII="
}


function handleImgSrc(src) {
    if (src instanceof Blob) {
        const url = window.URL || window.webkitURL;
        return url.createObjectURL(src)
    } else if (src instanceof String) {
        return src
    } else {
        return src
    }
}

/**
 * @parameter src {dataURL}
 */
function loadImageSrc(src) {
    return new Promise((res, rej) => {

        const img = new Image()

        img.onload = _ => {
            img.onerror = null;
            res(img)
        }
        img.onerror = e => {
            res(img)
        }

        img.src = handleImgSrc(src)
    })
}