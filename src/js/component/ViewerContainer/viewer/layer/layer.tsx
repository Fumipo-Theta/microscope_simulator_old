import React from "react"
import { SampleLayers, SampleOverlayKey } from "@src/js/type/sample_overlay"
import { ImageCenterInfo, SamplePackage } from "@src/js/type/entity"
import { systemLanguageState } from "@src/js/state/atom/system_language_state"
import { calcRelativePosition, getLabels, getAnnotations, calcToBeShown, calcToBeShownWhenMessageExists, selectByMode, selectByLang } from "./util"
import { Label } from "./label/label"
import { Annotation } from "./annotation/annotation"
import { useRecoilValue } from "recoil"
import { useShowLayersFlag } from "@src/js/hooks/location_hooks"

type Props = {
    viewerSize: number,
    layers: SampleLayers,
    rotate: number,
    isCrossed: boolean,
    imageCenterInfo: ImageCenterInfo,
}

const OPEN_TEXT_COLOR = "#111"
const CROSS_TEXT_COLOR = "#efefef"

export const Layer: React.FC<Props> = ({ viewerSize, layers, rotate, isCrossed, imageCenterInfo }) => {
    // TODO: remove this check after toggle layers button is implemented
    const layersToBeShown = useShowLayersFlag()
    if (!layersToBeShown) return <></>

    const lang = useRecoilValue(systemLanguageState)
    const labels = getLabels(layers, rotate)
    const annotations = getAnnotations(layers, rotate)

    return <>
        {
            ...labels.map((label, i) => {
                const pos = calcRelativePosition(label[SampleOverlayKey.LabelPositionFromLeftTop], imageCenterInfo, viewerSize)
                return <Label
                    key={`sample-overlay-label-${i}`}
                    left={pos.left}
                    top={pos.top}
                    text={selectByLang(label[SampleOverlayKey.LabelText], lang, "en")}
                    rotate={rotate}
                    toBeShown={calcToBeShown(isCrossed, label[SampleOverlayKey.LabelAppearsIn])}
                    color={selectByMode(label[SampleOverlayKey.LabelColor], isCrossed, OPEN_TEXT_COLOR, CROSS_TEXT_COLOR)}
                />
            })
        }
        {
            ...annotations.map((annotation, i) => {
                const pos = calcRelativePosition(annotation[SampleOverlayKey.AnnotationPositionFromLeftTop], imageCenterInfo, viewerSize)
                const text = annotation[SampleOverlayKey.AnnotationMessage]
                const appearsIn = annotation[SampleOverlayKey.AnnotationAppearsIn]
                return <Annotation
                    myKey={`sample-overlay-annotation-${i}`}
                    key={`sample-overlay-annotation-${i}`}
                    left={pos.left}
                    top={pos.top}
                    text={text}
                    rotate={rotate}
                    toBeShown={calcToBeShownWhenMessageExists(isCrossed, lang, appearsIn, text)}
                    color={selectByMode(annotation[SampleOverlayKey.AnnotationIconColor], isCrossed, OPEN_TEXT_COLOR, CROSS_TEXT_COLOR)}
                />
            })
        }
    </>
}
