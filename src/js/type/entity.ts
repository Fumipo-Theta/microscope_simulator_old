import { IRotationManager } from "./sample_viewer"
export type SampleImageType = 'jpg' | 'webp' | 'jp2'

export type Language = 'ja' | 'en'

export interface RectSize {
    width: number,
    height: number
}

type fromLeft = number
type fromTop = number
export type Coordinate = [fromLeft, fromTop]
export type NamedCoordinate = { fromLeft: fromLeft, fromTop: fromTop }

export type PackageId = string

export interface I18nMap<T> {
    Language?: T
}

export interface SampleMeta {
    isClockwise: boolean,
    location: I18nMap<string>,
    rockType: I18nMap<string>,
    owner: I18nMap<string>,
    description?: I18nMap<string>,
    rotateCenter: NamedCoordinate,
    imageWidth: number,
    imageHeight: number,
    imageRadius: number,
    rotateDegreeStep: number,
    scale: {
        scaleWidth?: number,
        scaleText?: string,
    }
}

export interface Manifest {
    ["package-id"]: PackageId,
    ["list-name"]: I18nMap<string>,
    image_width: number,
    image_height: number,
    rotate_center?: Coordinate,
    cycle_rotate_degree: number,
    rotate_clockwise: boolean,
    rotate_by_degree: number,
    location?: I18nMap<string>,
    owner?: I18nMap<string>,
    rock_type?: I18nMap<string>,
    description?: I18nMap<string>,
    discription?: I18nMap<string>,
    ["scale-unit"]?: string,
    ["scale-pixel"]?: number,
    magnify?: number,
    sample_label?: string,
    image_formats: Array<SampleImageType>,
    ["geographic-coordinate"]?: {
        system: string,
        position: {
            latitude: number,
            longitude: number
        }
    },
}

export interface Scale {
    label?: string | null,
    pixel?: number | null,
    imageRadius?: number | null,
    viewerSize?: number | null,
}

export interface SamplePackageZipped {
    thumbnail?: {
        "o1.jpg": CanvasImageSource,
        "c1.jpg": CanvasImageSource
    },
    lastModified?: string,
    id?: PackageId,
    image_format?: SampleImageType,
    zip?: any
    manifest?: string,
}

export interface SamplePackage {
    thumbnail?: {
        "o1.jpg": CanvasImageSource,
        "c1.jpg": CanvasImageSource
    },
    lastModified?: string,
    id?: PackageId,
    image_format?: SampleImageType,
    zip?: any
    manifest?: Manifest,
    open_images?: Array<CanvasImageSource>,
    cross_images?: Array<CanvasImageSource>,
}

export type ImageSource = {
    openImages: Array<CanvasImageSource>,
    crossImages: Array<CanvasImageSource>,
}

export type ImageCenterInfo = {
    rotateCenterToRight: number,
    rotateCenterToBottom: number,
    imageRadius: number,
}

export type ViewerState = {
    isCrossNicol: boolean,
    canvasWidth: number,
    canvasHeight: number,
    rotate: number,
    canRotate: boolean,
    drawHairLine: boolean,
    imageCenterInfo: ImageCenterInfo,
    supportedImageType?: SampleImageType,
    rotationHandler?: IRotationManager,
    //rotateDegreeStep: number,
    isRotateClockwise: boolean,
}

export type UiState = {
    sampleFilter: any,
    storedKeys: Array<string>,
    language: Language,
    sampleId?: PackageId,
    samplePackage: SamplePackage,
    sampleMeta?: SampleMeta,
    queryParams?: QueryParams,
}


export type inputState = {
    isMouseDown: boolean,
    dragStart?: Coordinate,
    dragEnd?: Coordinate,
    pinchStart?: Coordinate,
    pinchEnd?: Coordinate,
}

export type RootState = {
    viewerState: ViewerState,
    uiState: UiState,
    inputState: inputState,
    cacheStorage: {
        repo?: any,
        handler?: any,
    }
}

export interface QueryParams {
    sample_list?: string,
    category?: string,
}
