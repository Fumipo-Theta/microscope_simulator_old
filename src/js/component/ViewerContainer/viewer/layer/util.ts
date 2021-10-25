import { OverlayLabel, SampleLayers, SampleLayerKey, ItemLocation, WithMode, OverlayAnnotation, OverlayImage } from "@src/js/type/sample_overlay"
import { I18nMap, ImageCenterInfo, Language } from "@src/js/type/entity"

export function calcRelativePosition(pos: ItemLocation, imageCenterInfo: ImageCenterInfo, viewerSize, originalRadius) {
    const radius = imageCenterInfo.imageRadius
    const posFromCenter = [
        (pos[SampleLayerKey.X] - imageCenterInfo.rotateCenterToRight) / radius,
        (pos[SampleLayerKey.Y] - imageCenterInfo.rotateCenterToBottom) / radius
    ]

    return {
        left: (posFromCenter[0] / 2 + 0.5) * viewerSize,
        top: (posFromCenter[1] / 2 + 0.5) * viewerSize,
        magnify: originalRadius / radius
    }
}

export function calcToBeShown(isCrossed, appearsIn, rotate, appearsDuring) {
    const appear = (appearsIn === "both") ||
        (appearsIn === "crossed" && isCrossed) ||
        (appearsIn === "open" && !isCrossed)
    if (!appear) return false

    const inRange = appearsDuring.filter(([ini, fin]) => ini <= rotate && rotate < fin).length > 0
    return inRange
}

export function calcToBeShownWhenMessageExists(isCrossed, lang, appearsIn, message: WithMode<any>, rotate, appearsDuring) {
    const appear = (appearsIn === "both") ||
        (appearsIn === "crossed" && isCrossed) ||
        (appearsIn === "open" && !isCrossed)
    if (!appear) false
    const exists = isCrossed
        ? message?.[SampleLayerKey.InCross]?.[lang]
        : message?.[SampleLayerKey.InOpen]?.[lang]
    if (!exists) return false
    const inRange = appearsDuring.filter(([ini, fin]) => ini <= rotate && rotate < fin).length > 0
    return inRange
}

export function toBeAppear(rotate: number, appearsIn: Array<[number, number]>): boolean {
    return appearsIn.filter(([ini, fin]) => ini <= rotate && rotate < fin).length > 0
}

export function selectByMode<T>(withMode: WithMode<T>, isCrossed: boolean, fallbackOpen: T, fallbackCross: T): T {
    return isCrossed
        ? withMode?.[SampleLayerKey.InCross] || fallbackCross
        : withMode?.[SampleLayerKey.InOpen] || fallbackOpen
}

export function selectByModeAndLang<T>(withMode: WithMode<I18nMap<T>>, isCrossed: boolean, lang: Language): T | null {
    const content = isCrossed
        ? withMode?.[SampleLayerKey.InCross]
        : withMode?.[SampleLayerKey.InOpen]

    return content?.[lang]
}

export function selectByLang<T>(content: I18nMap<T>, lang: Language, fallbackLang: Language): T | null {
    return content?.[lang] || content?.[fallbackLang]
}

export function getOverlays(layers: SampleLayers): OverlayImage[] {
    try {
        return layers[SampleLayerKey.Layers]
            .flatMap(layer => layer[SampleLayerKey.Overlays] || [])
    } catch {
        console.error("Failed to parse layers.json")
        return []
    }
}

export function getLabels(layers: SampleLayers): OverlayLabel[] {
    if (!layers) return []

    try {
        return layers[SampleLayerKey.Layers]
            .flatMap(layer => layer[SampleLayerKey.Labels] || [])
    } catch {
        console.error("Failed to parse layers.json")
        return []
    }
}

export function getAnnotations(layers: SampleLayers): OverlayAnnotation[] {
    if (!layers) return []

    try {
        return layers[SampleLayerKey.Layers]
            .flatMap(layer => layer[SampleLayerKey.Annotations] || [])
    } catch {
        console.error("Failed to parse layers.json")
        return []
    }
}
