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
    originalImageSize: { width: number, height: number },
}

export const InteractionHandler: React.FC<Props> = ({ viewerSize, _ref, rotate, ...childProps }) => {
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
        <Layer viewerSize={viewerSize} rotate={rotate} {...childProps} />
    </div>
}
