import React, { useState } from "react"
import { useRecoilValue } from "recoil"
import { NicolToggler } from "./nicol_toggler/nicol_toggler"
import { Canvas } from "./canvas/canvas"
import { Scale } from "./scale/scale"
import { ImageSrcProvider } from "./image_src_provider"
import { windowInnerSizeState } from "@src/js/state/atom/window_inner_size_state"
import { isOpenNicolState } from "@src/js/state/atom/nicol_state"
import { samplePackageState } from "@src/js/state/atom/sample_package_state"
import { systemLanguageState } from "@src/js/state/atom/system_language_state"
import { SamplePackage, SampleMeta, Manifest, ImageSource } from "@src/js/type/entity"
import styles from "./index.module.css"

type DescriptionProps = {
    sample: SamplePackage
}

const DescriptionContainer: React.FC<DescriptionProps> = ({ sample }) => {
    const manifest: Manifest = sample.manifest // TODO: replace function take manifest and return SampleMeta
    const lang = useRecoilValue(systemLanguageState)
    return (
        <div className={styles.descriptionContainer}>
            {manifest.rock_type[lang] && manifest.rock_type[lang] != "" ? <p>{manifest.rock_type[lang]}</p> : <></>}
            {manifest.location[lang] && manifest.location[lang] != "" ? <p>{manifest.location[lang]}</p> : <></>}
            <p>{manifest.description[lang]}</p>
            <p>{manifest.owner}</p>
        </div>
    )
}

export const ViewerContainer: React.FC = () => {
    const currentSample = useRecoilValue(samplePackageState)
    const mainLayerProps = {
        ...useRecoilValue(windowInnerSizeState),
        sample: currentSample
    }

    return (
        <>
            {currentSample ?
                <><div className={styles.viewerLayerContainer}>
                    <div>
                        <Canvas {...mainLayerProps} />
                    </div>
                    <Scale width={100} label={"10mm"} />
                </div>
                    <NicolToggler />
                    <DescriptionContainer sample={currentSample} />
                </> :
                <></>
            }
        </>
    )
}