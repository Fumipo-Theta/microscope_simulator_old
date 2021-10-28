import { sampleOverLayMapState } from "@src/js/state/atom/sample_overlay_map_state"
import React from "react"
import { useRecoilValue } from "recoil"
import styles from "./index.module.css"

type OverlayProps = {
    toBeShown: boolean,
    srcKey: string,
    top: number,
    left: number,
    magnify: number,
}

const preventDefault = (e) => {
    return
    e.preventDefault()
}

export const Overlay: React.FC<OverlayProps> = ({ toBeShown, srcKey, top, left, magnify }) => {
    const sampleOverlayData = useRecoilValue(sampleOverLayMapState)
    const dataUrl = sampleOverlayData[srcKey]
    const dynamicStyle = {
        top: top,
        left: left,
        width: `${magnify * 100}%`,
    }
    const className = `${styles.overlay} ${toBeShown ? styles.active : ""}`

    return <img className={className} src={dataUrl} style={{ position: "absolute", ...dynamicStyle }} onClick={preventDefault} onMouseMove={preventDefault} />
}
