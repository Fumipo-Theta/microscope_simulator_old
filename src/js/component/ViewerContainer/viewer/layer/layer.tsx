import React from "react"
import { SampleLayers, SampleOverlayKey } from "@src/js/type/sample_overlay"
import { ImageCenterInfo, SamplePackage } from "@src/js/type/entity"
import { calcRelativePosition, genLabels, calcToBeShown, selectByMode } from "./util"
import { Label } from "./label/label"

type Props = {
    sample: SamplePackage,
    viewerSize: number,
    _ref: React.MutableRefObject<HTMLDivElement>,
    layers: SampleLayers,
    rotate: number,
    isCrossed: boolean,
    imageCenterInfo: ImageCenterInfo,
}

const OPEN_TEXT_COLOR = "#111"
const CROSS_TEXT_COLOR = "#efefef"

export const Layer: React.FC<Props> = ({ sample, viewerSize, _ref, layers, rotate, isCrossed, imageCenterInfo }) => {
    const style = {
        width: viewerSize,
        height: viewerSize,
        gridRow: "1 / 1",
        gridColumn: "1 / 1",
        borderRadius: "50%",
        transform: `rotate(${-rotate}deg)`,
        overflow: "hidden",
    }
    const labels = genLabels(layers)

    return <div ref={_ref} style={{ position: "absolute", ...style }}>
        {...labels.map(label => {
            const pos = calcRelativePosition(label[SampleOverlayKey.LabelPositionFromLeftTop], imageCenterInfo, viewerSize)
            return <Label
                left={pos.left}
                top={pos.left}
                text={label[SampleOverlayKey.LabelText]}
                rotate={rotate}
                toBeShown={calcToBeShown(isCrossed, label[SampleOverlayKey.LabelAppearsIn])}
                color={selectByMode(label[SampleOverlayKey.LabelColor], isCrossed, OPEN_TEXT_COLOR, CROSS_TEXT_COLOR)}
            />
        })
        }
    </div>
}
