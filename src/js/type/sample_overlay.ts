import { I18nMap } from "./entity"

export enum SampleOverlayKey {
    Layers = "layers",
    ReferenceRotationDegree = "reference_rotation_degree",
    AppearsDuring = "appears_during",
    Overlay = "overlay",
    OverlayImageType = "image_type",
    OverlayImageSource = "image_source",
    InOpen = "in_open",
    InCross = "in_crossed",

    Labels = "labels",
    LabelAppearsIn = "appears_in",
    LabelPositionFromLeftTop = "position_from_left_top",
    LabelText = "text",
    LabelColor = "color",

    Annotations = "annotations",
    AnnotationAppearsIn = "appears_in",
    AnnotationPositionFromLeftTop = "position_from_left_top",
    AnnotationIconColor = "icon_color",
    AnnotationMessage = "message",

    X = "x",
    Y = "y",

}

export interface SampleLayers {
    [SampleOverlayKey.Layers]: Array<SampleOverlay>
}

export interface SampleOverlay {
    [SampleOverlayKey.ReferenceRotationDegree]: number
    [SampleOverlayKey.AppearsDuring]: Array<[number, number]>
    [SampleOverlayKey.Overlay]?: OverlayImage
    [SampleOverlayKey.Labels]?: OverlayLabel[]
    [SampleOverlayKey.Annotations]?: OverlayAnnotation[]
}

export type ItemLocation = {
    [SampleOverlayKey.X]: number,
    [SampleOverlayKey.Y]: number,
}

export type WithMode<T> = {
    [SampleOverlayKey.InOpen]?: T,
    [SampleOverlayKey.InCross]?: T,
}


export type OverlayImage = {
    [SampleOverlayKey.OverlayImageType]: OverlayImageType
    [SampleOverlayKey.OverlayImageSource]: WithMode<string>
}
export type OverlayImageType = "png" | "svg"

export type OverlayLabel = {
    [SampleOverlayKey.LabelAppearsIn]: "open" | "crossed" | "both"
    [SampleOverlayKey.LabelPositionFromLeftTop]: ItemLocation
    [SampleOverlayKey.LabelText]: I18nMap<string>
    [SampleOverlayKey.LabelColor]?: WithMode<string>
}

export type OverlayAnnotation = {
    [SampleOverlayKey.AnnotationAppearsIn]: "open" | "crossed" | "both"
    [SampleOverlayKey.AnnotationPositionFromLeftTop]: ItemLocation
    [SampleOverlayKey.AnnotationIconColor]?: WithMode<string>
    [SampleOverlayKey.AnnotationMessage]: WithMode<I18nMap<string>>
}