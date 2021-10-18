import React from "react"

type LabelProps = {
    text: string,
    top: number,
    left: number,
    rotate: number,
    toBeShown: boolean,
    color: string,
}

export const Label: React.FC<LabelProps> = ({ text, top, left, rotate, toBeShown, color }) => {
    const dynamicStyle = {
        top: top,
        left: left,
        transform: `rotate(${rotate}deg)`,
        transformOrigin: "top left",
        opacity: toBeShown ? 100 : 0,
        color: color,
    }
    const style = {
        fontSize: "1.25rem",
        width: "fit-content",
    }
    return <div style={{ position: "relative", ...dynamicStyle, ...style }}>{text}</div>
}
