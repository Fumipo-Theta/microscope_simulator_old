export enum SampleOverlayKey {
    Layers = "layers",
    ReferenceRotationDegree = "reference_rotation_degree",
    AppearsDuring = "appears_during",
    Overlay = "overlay",
    OverlayImageType = "image_type",
    OverlayImageSourceUrl = "image_source_url",
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

type ItemLocation = {
    [SampleOverlayKey.X]: number,
    [SampleOverlayKey.Y]: number,
}

type WithMode<T> = {
    [SampleOverlayKey.InOpen]?: T,
    [SampleOverlayKey.InCross]?: T,
}


type OverlayImage = {
    [SampleOverlayKey.OverlayImageType]: OverlayImageType
    [SampleOverlayKey.OverlayImageSourceUrl]: WithMode<string>
}
export type OverlayImageType = "png" | "svg"

type OverlayLabel = {
    [SampleOverlayKey.LabelAppearsIn]: "open" | "crossed" | "both"
    [SampleOverlayKey.LabelPositionFromLeftTop]: ItemLocation
    [SampleOverlayKey.LabelText]: string
    [SampleOverlayKey.LabelColor]?: WithMode<string>
}

type OverlayAnnotation = {
    [SampleOverlayKey.AnnotationAppearsIn]: "open" | "crossed" | "both"
    [SampleOverlayKey.AnnotationPositionFromLeftTop]: ItemLocation
    [SampleOverlayKey.AnnotationIconColor]?: WithMode<string>
    [SampleOverlayKey.AnnotationMessage]: WithMode<string>
}