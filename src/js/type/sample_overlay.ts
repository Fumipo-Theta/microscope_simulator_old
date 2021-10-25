import { I18nMap } from "./entity"

export enum SampleLayerKey {
    Layers = "layers",
    ReferenceRotationDegree = "reference_rotation_degree",
    AppearsDuring = "appears_during",
    Overlays = "overlays",
    OverlayImageType = "image_type",
    OverlayImageSource = "image_source",
    InOpen = "in_open",
    InCross = "in_crossed",

    Labels = "labels",
    AppearsIn = "appears_in",
    LabelPositionFromLeftTop = "position_from_left_top",
    LabelText = "text",
    LabelColor = "color",

    Annotations = "annotations",
    AnnotationPositionFromLeftTop = "position_from_left_top",
    AnnotationIconColor = "icon_color",
    AnnotationMessage = "message",

    X = "x",
    Y = "y",

}

export interface SampleLayers {
    [SampleLayerKey.Layers]: Array<SampleOverlay>
}


export interface SampleOverlay {
    [SampleLayerKey.ReferenceRotationDegree]: number
    [SampleLayerKey.Overlays]?: OverlayImage[]
    [SampleLayerKey.Labels]?: OverlayLabel[]
    [SampleLayerKey.Annotations]?: OverlayAnnotation[]
}

export type ItemLocation = {
    [SampleLayerKey.X]: number,
    [SampleLayerKey.Y]: number,
}

export type WithMode<T> = {
    [SampleLayerKey.InOpen]?: T,
    [SampleLayerKey.InCross]?: T,
}


export type OverlayImage = {
    [SampleLayerKey.AppearsIn]: "open" | "crossed" | "both"
    [SampleLayerKey.AppearsDuring]: Array<[number, number]>
    [SampleLayerKey.OverlayImageType]: OverlayImageType
    [SampleLayerKey.OverlayImageSource]: SampleOverlayPath
}
export type OverlayImageType = "png" | "svg"
export type SampleOverlayPath = string
type DataURL = string
export type SampleOverlayMap = {
    [key: SampleOverlayPath]: DataURL
}

export type OverlayLabel = {
    [SampleLayerKey.AppearsIn]: "open" | "crossed" | "both"
    [SampleLayerKey.LabelPositionFromLeftTop]: ItemLocation
    [SampleLayerKey.AppearsDuring]: Array<[number, number]>
    [SampleLayerKey.LabelText]: I18nMap<string>
    [SampleLayerKey.LabelColor]?: WithMode<string>
}

export type OverlayAnnotation = {
    [SampleLayerKey.AppearsIn]: "open" | "crossed" | "both"
    [SampleLayerKey.AnnotationPositionFromLeftTop]: ItemLocation
    [SampleLayerKey.AppearsDuring]: Array<[number, number]>
    [SampleLayerKey.AnnotationIconColor]?: WithMode<string>
    [SampleLayerKey.AnnotationMessage]: WithMode<I18nMap<string>>
}