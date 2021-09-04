import React from "react"
import { useRecoilValue } from "recoil"
import { NicolToggler } from "./nicol_toggler/nicol_toggler"
import { Canvas } from "./canvas/canvas"
import { Scale } from "./scale/scale"
import { windowInnerSizeState } from "@src/js/state/atom/window_inner_size_state"
import { isOpenNicolState } from "@src/js/state/atom/nicol_state"
import styles from "./index.module.css"


const DescriptionContainer: React.FC = () => {
    const isOpenNicol = useRecoilValue(isOpenNicolState)
    return (
        <div className={styles.descriptionContainer}>
            {isOpenNicol ? "Open" : "Cross"}\n
            Quartz showing wavy extinction in granite (center of the field of view).
            When the crystal structure of quartz is distorted, it sometimes shows wavy extinction,
            in which the extinct area shifts with the rotation of the field of view,
            instead of quenching the whole particle at the same time in the crossed-nicols.
        </div>
    )
}

export const ViewerContainer: React.FC = () => {
    const onClick = (e) => { console.log("canvas clicked") }
    const mainLayerProps = {
        ...useRecoilValue(windowInnerSizeState),
        addHandlers: (canvas: HTMLCanvasElement) => {
            canvas.addEventListener("click", onClick, false)
        },
        removeHandlers: (canvas: HTMLCanvasElement) => {
            canvas.removeEventListener("click", onClick)
        }
    }

    return (
        <>
            <div className={styles.viewerLayerContainer}>
                <div>
                    <Canvas {...mainLayerProps} />
                </div>
                <Scale width={100} label={"10mm"} />
            </div>
            <NicolToggler />
            <DescriptionContainer />
        </>
    )
}