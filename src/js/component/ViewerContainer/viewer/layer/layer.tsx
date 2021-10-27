import React from "react"
import { useRecoilValue } from "recoil"
import { SampleLayers, SampleLayerKey } from "@src/js/type/sample_overlay"
import { ImageCenterInfo } from "@src/js/type/entity"
import { systemLanguageState } from "@src/js/state/atom/system_language_state"
import { calcRelativePosition, getOverlays, getLabels, getAnnotations, calcToBeShown, calcToBeShownWhenMessageExists, selectByMode, selectByLang } from "./util"
import { Overlay } from "./overlay/overlay"
import { Label } from "./label/label"
import { Annotation } from "./annotation/annotation"

type Props = {
    viewerSize: number,
    layers: SampleLayers | null,
    rotate: number,
    isCrossed: boolean,
    imageCenterInfo: ImageCenterInfo,
    originalRadius: number,
    originalImageSize: { width: number, height: number },
}

const OPEN_TEXT_COLOR = "#111"
const CROSS_TEXT_COLOR = "#efefef"

export const Layer: React.FC<Props> = ({ viewerSize, layers, rotate, isCrossed, imageCenterInfo, originalRadius, originalImageSize }) => {
    if (!layers) return <></>

    const lang = useRecoilValue(systemLanguageState)
    const overlays = getOverlays(layers)
    const labels = getLabels(layers)
    const annotations = getAnnotations(layers)

    return <>
        {
            ...overlays.map((overlay, i) => {
                const pos = calcRelativePosition({ x: 0, y: 0 }, imageCenterInfo, viewerSize, Math.min(originalImageSize.width, originalImageSize.height) / 2)
                return <Overlay
                    key={`sample-overlay-image-${i}`}
                    toBeShown={calcToBeShown(isCrossed, overlay[SampleLayerKey.AppearsIn], rotate, overlay[SampleLayerKey.AppearsDuring])}
                    srcKey={overlay[SampleLayerKey.OverlayImageSource]}
                    left={pos.left}
                    top={pos.top}
                    magnify={pos.magnify}
                />
            })
        }
        {
            ...labels.map((label, i) => {
                const pos = calcRelativePosition(label[SampleLayerKey.LabelPositionFromLeftTop], imageCenterInfo, viewerSize, originalRadius)
                return <Label
                    key={`sample-overlay-label-${i}`}
                    left={pos.left}
                    top={pos.top}
                    text={selectByLang(label[SampleLayerKey.LabelText], lang, "en")}
                    rotate={rotate}
                    toBeShown={calcToBeShown(isCrossed, label[SampleLayerKey.AppearsIn], rotate, label[SampleLayerKey.AppearsDuring])}
                    color={selectByMode(label[SampleLayerKey.LabelColor], isCrossed, OPEN_TEXT_COLOR, CROSS_TEXT_COLOR)}
                />
            })
        }
        {
            ...annotations.map((annotation, i) => {
                const pos = calcRelativePosition(annotation[SampleLayerKey.AnnotationPositionFromLeftTop], imageCenterInfo, viewerSize, originalRadius)
                const text = annotation[SampleLayerKey.AnnotationMessage]
                const appearsIn = annotation[SampleLayerKey.AppearsIn]
                return <Annotation
                    myKey={`sample-overlay-annotation-${i}`}
                    key={`sample-overlay-annotation-${i}`}
                    left={pos.left}
                    top={pos.top}
                    text={text}
                    rotate={rotate}
                    toBeShown={calcToBeShownWhenMessageExists(isCrossed, lang, appearsIn, text, rotate, annotation[SampleLayerKey.AppearsDuring])}
                    color={selectByMode(annotation[SampleLayerKey.AnnotationIconColor], isCrossed, OPEN_TEXT_COLOR, CROSS_TEXT_COLOR)}
                />
            })
        }
    </>
}
