import React from "react"
import { SampleLayers, SampleOverlayKey } from "@src/js/type/sample_overlay"
import { ImageCenterInfo, SamplePackage } from "@src/js/type/entity"
import { calcRelativePosition, getLabels, getAnnotations, calcToBeShown, selectByMode } from "./util"
import { Label } from "./label/label"
import { Annotation } from "./annotation/annotation"

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
                    text={label[SampleOverlayKey.LabelText]}
                    rotate={rotate}
                    toBeShown={calcToBeShown(isCrossed, label[SampleOverlayKey.LabelAppearsIn])}
                    color={selectByMode(label[SampleOverlayKey.LabelColor], isCrossed, OPEN_TEXT_COLOR, CROSS_TEXT_COLOR)}
                />
            })
        }
        {
            ...annotations.map((annotation, i) => {
                const pos = calcRelativePosition(annotation[SampleOverlayKey.AnnotationPositionFromLeftTop], imageCenterInfo, viewerSize)
                return <Annotation
                    key={`sample-overlay-annotation-${i}`}
                    left={pos.left}
                    top={pos.top}
                    text={annotation[SampleOverlayKey.AnnotationMessage]}
                    rotate={rotate}
                    toBeShown={calcToBeShown(isCrossed, annotation[SampleOverlayKey.AnnotationAppearsIn])}
                    color={selectByMode(annotation[SampleOverlayKey.AnnotationIconColor], isCrossed, OPEN_TEXT_COLOR, CROSS_TEXT_COLOR)}
                />
            })
        }
    </>
}
