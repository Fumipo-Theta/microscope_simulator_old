import React from "react"

type Props = {
    viewerSize: number,
    _ref: React.MutableRefObject<HTMLDivElement>
}

export const InteractionHandler: React.FC<Props> = ({ viewerSize, _ref }) => {
    const style = {
        width: viewerSize,
        height: viewerSize,
        gridRow: "1 / 1",
        gridColumn: "1 / 1",
        borderRadius: "50%",
    }
    return <div ref={_ref} style={{ position: "absolute", ...style }}></div>
}
