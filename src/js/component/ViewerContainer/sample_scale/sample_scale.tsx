import React from "react"
import { useRecoilValue } from "recoil"
import { scaleState } from "@src/js/state/atom/scale_state"
import { Scale } from "@src/js/type/entity"
import styles from "./index.module.css"

type Props = {
}

const ScaleLabel: React.FC<{ label: string }> = ({ label }) => <div className={styles.scaleLabel}>{label}</div>

const ScaleBar: React.FC<{ width: number }> = ({ width }) => <div className={styles.scaleBar} style={{ width: `${width}px` }}></div>

export const SampleScale: React.FC<Props> = () => {
    const scale = useRecoilValue(scaleState)
    const { label: currentLabel, length: currentLength } = computeScale(scale)
    return (

        <div className={styles.scale}>
            <ScaleBar width={currentLength} />
            <ScaleLabel label={currentLabel} />
        </div>
    )
}

const computeScale = ({ label = null, viewerSize = null, imageRadius = null, pixel = null }: Scale) => {
    if (!label || !pixel) return { label: null, length: null }
    let scalePixel = viewerSize * pixel / imageRadius
    let scaleNumber = parseFloat(label.match(/(\d+\.?\d*)/)[0]) * 1
    const scaleUnit = label.match(/\D*$/)[0]

    while (scalePixel >= viewerSize) {
        scalePixel *= 0.5
        scaleNumber *= 0.5
    }
    return {
        length: scalePixel,
        label: `${scaleNumber} ${scaleUnit}`
    }
}