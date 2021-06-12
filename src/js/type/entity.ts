export type SampleImageType = 'jpg' | 'webp' | 'jp2'

export type SamplePackage = {
    manifest: String,
    thumbnail: {
        "o1.jpg": CanvasImageSource,
        "c1.jpg": CanvasImageSource
    },
    lastModified: String,
    id: String,
    image_format: SampleImageType,
    open_images: Array<CanvasImageSource>,
    cross_images: Array<CanvasImageSource>,
}

export type ImageCenterInfo = {
    rotateCenterToRight: number,
    rotateCenterToBottom: number,
    imageRadius: number,
}

export type ViewerState = {
    isCrossNicol: boolean,
    open_images: Array<CanvasImageSource>,
    cross_images: Array<CanvasImageSource>,
    canvasWidth: number,
    canvasHeight: number,
    rotate: number,
    rotateCenterToRight: number,
    rotateCenterToBottom: number,
    imageRadius: number,
    //rotateDegreeStep: number,
    //rotateIsClockwise: number,
}
