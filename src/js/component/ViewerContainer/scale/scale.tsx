import React from "react"
import styles from "./index.module.css"

type Props = {
    width: number,
    label: string,
}

const ScaleLabel: React.FC<{ label: string }> = ({ label }) => <div className={styles.scaleLabel}>{label}</div>

const ScaleBar: React.FC<{ width: number }> = ({ width }) => <div className={styles.scaleBar} style={{ width: `${width}px` }}></div>

export const Scale: React.FC<Props> = ({ width, label }) => {
    return (
        <div className={styles.scale}>
            <ScaleLabel label={label} />
            <ScaleBar width={width} />
        </div>
    )
}