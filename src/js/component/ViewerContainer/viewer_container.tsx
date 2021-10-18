import React from "react"
import { useRecoilValue } from "recoil"
import { AnnotationContent } from "./viewer/layer/annotation/annotation"
import { NicolToggler } from "./nicol_toggler/nicol_toggler"
import { Viewer } from "./viewer/viewer"
import { SampleScale } from "./sample_scale/sample_scale"
import { Welcome } from "@src/js/component/welcome/welcome"
import { windowInnerSizeState } from "@src/js/state/atom/window_inner_size_state"
import { samplePackageState } from "@src/js/state/atom/sample_package_state"
import { sampleLayersState } from "@src/js/state/atom/sample_layers_state"
import { systemLanguageState } from "@src/js/state/atom/system_language_state"
import { SamplePackage, Manifest, Language } from "@src/js/type/entity"
import { withFallbackLanguage } from "@src/js/util/language_util"
import styles from "./index.module.css"

type DescriptionProps = {
    sample: SamplePackage
}

const RockType: React.FC<{ manifest: Manifest, lang: Language }> = ({ manifest, lang }) => {
    return <span>{withFallbackLanguage(manifest.rock_type, lang, "en")}</span>
}
const SampleLocation: React.FC<{ manifest: Manifest, lang: Language }> = ({ manifest, lang }) => {
    return <span>{withFallbackLanguage(manifest.location, lang, "en")}</span>
}
const Description: React.FC<{ manifest: Manifest, lang: Language }> = ({ manifest, lang }) => {
    const description = manifest.hasOwnProperty("description")
        ? manifest.description
        : manifest.hasOwnProperty("discription") // There are some miss-spelled packages...
            ? manifest.discription
            : {}
    return <span>{withFallbackLanguage(description, lang, "en")}</span>
}

const DescriptionContainer: React.FC<DescriptionProps> = ({ sample }) => {
    const manifest: Manifest = sample.manifest // TODO: replace function take manifest and return SampleMeta
    const lang = useRecoilValue(systemLanguageState)
    return (
        <div className={styles.descriptionContainer}>
            <p>
                <RockType manifest={manifest} lang={lang} />
                {" "}
                <SampleLocation manifest={manifest} lang={lang} />
            </p>
            <p><Description manifest={manifest} lang={lang} /></p>
            <p>{manifest.owner}</p>
        </div>
    )
}

export const ViewerContainer: React.FC = () => {
    const currentSample = useRecoilValue(samplePackageState)
    const currentLayers = useRecoilValue(sampleLayersState)
    const mainLayerProps = {
        ...useRecoilValue(windowInnerSizeState),
        sample: currentSample,
        layers: currentLayers,
    }
    return (
        <>
            {currentSample ?
                <><div className={styles.viewerLayerContainer}>
                    <Viewer {...mainLayerProps} />
                    <AnnotationContent />
                    <SampleScale />
                    <NicolToggler />
                </div>
                    <DescriptionContainer sample={currentSample} />
                </> :
                <Welcome />
            }
        </>
    )
}