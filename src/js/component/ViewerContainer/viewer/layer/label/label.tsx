import React from "react"
import styles from "./index.module.css"

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
        color: color,
    }
    const className = `${styles.label} ${toBeShown ? styles.active : ""}`

    return <div className={className} style={{ position: "absolute", ...dynamicStyle }}>{text}</div>
}
