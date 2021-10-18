import { OverlayLabel, SampleLayers, SampleOverlayKey, ItemLocation, WithMode } from "@src/js/type/sample_overlay"
import { ImageCenterInfo } from "@src/js/type/entity"

export function calcRelativePosition(pos: ItemLocation, imageCenterInfo: ImageCenterInfo, viewerSize) {
    const posFromCenter = [
        pos[SampleOverlayKey.X] - imageCenterInfo.rotateCenterToRight,
        pos[SampleOverlayKey.Y] - imageCenterInfo.rotateCenterToBottom
    ]
    const radius = imageCenterInfo.imageRadius
    return {
        left: (posFromCenter[0] + radius) / (2 * radius) * viewerSize,
        top: (radius - posFromCenter[1]) / (2 * radius) * viewerSize
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

export function genLabels(layers: SampleLayers): OverlayLabel[] {
    if (!layers) return []
    return layers[SampleOverlayKey.Layers]
        .flatMap(layer => layer[SampleOverlayKey.Labels] || [])
}
