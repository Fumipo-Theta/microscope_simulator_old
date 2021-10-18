import { OverlayLabel, SampleLayers, SampleOverlayKey, ItemLocation, WithMode, OverlayAnnotation } from "@src/js/type/sample_overlay"
import { ImageCenterInfo } from "@src/js/type/entity"

export function calcRelativePosition(pos: ItemLocation, imageCenterInfo: ImageCenterInfo, viewerSize) {
    const radius = imageCenterInfo.imageRadius
    const posFromCenter = [
        (pos[SampleOverlayKey.X] - imageCenterInfo.rotateCenterToRight) / radius,
        (pos[SampleOverlayKey.Y] - imageCenterInfo.rotateCenterToBottom) / radius
    ]

    return {
        left: (posFromCenter[0] / 2 + 0.5) * viewerSize,
        top: (posFromCenter[1] / 2 + 0.5) * viewerSize
    }
}

export function calcToBeShown(isCrossed, appearsIn) {
    return (appearsIn === "both") ||
        (appearsIn === "crossed" && isCrossed) ||
        (appearsIn === "open" && !isCrossed)
}

export function selectByMode<T>(withMode: WithMode<T>, isCrossed: boolean, fallbackOpen: T, fallbackCross: T): T {
    return isCrossed
        ? withMode?.[SampleOverlayKey.InCross] || fallbackCross
        : withMode?.[SampleOverlayKey.InOpen] || fallbackOpen
}

export function getLabels(layers: SampleLayers): OverlayLabel[] {
    if (!layers) return []
    return layers[SampleOverlayKey.Layers]
        .flatMap(layer => layer[SampleOverlayKey.Labels] || [])
}

export function getAnnotations(layers: SampleLayers): OverlayAnnotation[] {
    if (!layers) return []
    return layers[SampleOverlayKey.Layers]
        .flatMap(layer => layer[SampleOverlayKey.Annotations] || [])
}
