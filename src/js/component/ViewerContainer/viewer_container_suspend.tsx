import React from "react"
import { useRecoilValue } from "recoil"
import CircularProgress from '@material-ui/core/CircularProgress';
import { windowInnerSizeState } from "@src/js/state/atom/window_inner_size_state"
import { NicolToggler } from "./nicol_toggler/nicol_toggler"
import styles from "./index.module.css"
import scaleScaleStyles from "@src/js/component/ViewerContainer/sample_scale/index.module.css"

const dummyCanvasStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "5px",
    borderRadius: "50%",
    boxShadow: "2px 1px 4px #a0a0a0, -2px -1px 4px #ffffff",
}

export const ViewerContainerSuspend: React.FC = () => {
    const { width, height } = useRecoilValue(windowInnerSizeState)
    const viewerSize = getMaxViewerSize(width, height)
    return <><div className={styles.viewerLayerContainer} >
        <div style={{ width: viewerSize, height: viewerSize, ...dummyCanvasStyle }}>
            <CircularProgress size={"5rem"} />
        </div>
        <div className={scaleScaleStyles.scale} style={{ alignItems: "center", maxWidth: "50vw", width: "300px" }}>
            <div className={scaleScaleStyles.scaleBar} style={{ width: "100%" }}></div>
            <div className={scaleScaleStyles.scaleLabel}>Scale</div>
        </div>
        <NicolToggler />
    </div >
        <div className={styles.descriptionContainer} style={{ height: "100px" }}>
            Now loading...
        </div>
    </>
}

const getMaxViewerSize = (windowWidth, windowHeight) => {
    const padding = 20 // px
    const navigationAndNicolHeight = 64 + 100 + 20 // px
    const width = windowWidth
    const height = windowHeight - navigationAndNicolHeight
    return (width < height ? width : height) - padding
}