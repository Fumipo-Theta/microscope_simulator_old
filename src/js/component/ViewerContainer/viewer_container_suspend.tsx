import React from "react"
import { useRecoilValue } from "recoil"
import CircularProgress from '@material-ui/core/CircularProgress';
import { windowInnerSizeState } from "@src/js/state/atom/window_inner_size_state"
import styles from "./index.module.css"

export const ViewerContainerSuspend: React.FC = () => {
    const { width, height } = useRecoilValue(windowInnerSizeState)
    const viewerSize = getMaxViewerSize(width, height)
    return <div className={styles.viewerLayerContainer} style={{ width: viewerSize, height: viewerSize }}>
        <CircularProgress size={"5rem"} />
    </div>
}

const getMaxViewerSize = (windowWidth, windowHeight) => {
    const padding = 20 // px
    const navigationAndNicolHeight = 64 + 100 + 20 // px
    const width = windowWidth
    const height = windowHeight - navigationAndNicolHeight
    return (width < height ? width : height) - padding
}