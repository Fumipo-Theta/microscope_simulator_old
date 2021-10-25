import { SampleLayers } from "@src/js/type/sample_overlay"
import { ImageCenterInfo } from "@src/js/type/entity"
import React from "react"
import { Layer } from "./layer/layer"

type Props = {
    viewerSize: number,
    _ref: React.MutableRefObject<HTMLDivElement>,
    layers: SampleLayers,
    isCrossed: boolean,
    rotate: number,
    imageCenterInfo: ImageCenterInfo,
    originalRadius: number,
}

export const InteractionHandler: React.FC<Props> = ({ viewerSize, _ref, layers, isCrossed, rotate, imageCenterInfo, originalRadius }) => {
    const style = {
        width: viewerSize,
        height: viewerSize,
        gridRow: "1 / 1",
        gridColumn: "1 / 1",
        borderRadius: "50%",
        transform: `rotate(${-rotate}deg)`,
        overflow: "hidden",
    }

    return <div ref={_ref} style={{ position: "absolute", ...style }}>
        <Layer layers={layers} viewerSize={viewerSize} rotate={rotate} isCrossed={isCrossed} imageCenterInfo={imageCenterInfo} originalRadius={originalRadius} />
    </div>
}
