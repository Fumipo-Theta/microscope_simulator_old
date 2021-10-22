import { OverlayLabel, SampleLayers, SampleOverlayKey, ItemLocation, WithMode, OverlayAnnotation } from "@src/js/type/sample_overlay"
import { I18nMap, ImageCenterInfo, Language } from "@src/js/type/entity"

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

export function calcToBeShownWhenMessageExists(isCrossed, lang, appearsIn, message: WithMode<any>) {
    const appear = (appearsIn === "both") ||
        (appearsIn === "crossed" && isCrossed) ||
        (appearsIn === "open" && !isCrossed)
    const exists = isCrossed
        ? message?.[SampleOverlayKey.InCross]?.[lang]
        : message?.[SampleOverlayKey.InOpen]?.[lang]
    return appear && exists
}

export function toBeAppear(rotate: number, appearsIn: Array<[number, number]>): boolean {
    return appearsIn.filter(([ini, fin]) => ini < rotate && rotate < fin).length > 0
}

export function selectByMode<T>(withMode: WithMode<T>, isCrossed: boolean, fallbackOpen: T, fallbackCross: T): T {
    return isCrossed
        ? withMode?.[SampleOverlayKey.InCross] || fallbackCross
        : withMode?.[SampleOverlayKey.InOpen] || fallbackOpen
}

export function selectByModeAndLang<T>(withMode: WithMode<I18nMap<T>>, isCrossed: boolean, lang: Language): T | null {
    const content = isCrossed
        ? withMode?.[SampleOverlayKey.InCross]
        : withMode?.[SampleOverlayKey.InOpen]

    return content?.[lang]
}

export function selectByLang<T>(content: I18nMap<T>, lang: Language, fallbackLang: Language): T | null {
    return content?.[lang] || content?.[fallbackLang]
}

export function getLabels(layers: SampleLayers, rotate: number): OverlayLabel[] {
    if (!layers) return []
    return layers[SampleOverlayKey.Layers]
        .flatMap(layer => toBeAppear(rotate, layer[SampleOverlayKey.AppearsDuring]) ? layer[SampleOverlayKey.Labels] || [] : [])
}

export function getAnnotations(layers: SampleLayers, rotate: number): OverlayAnnotation[] {
    if (!layers) return []
    return layers[SampleOverlayKey.Layers]
        .flatMap(layer => toBeAppear(rotate, layer[SampleOverlayKey.AppearsDuring]) ? layer[SampleOverlayKey.Annotations] || [] : [])
}
