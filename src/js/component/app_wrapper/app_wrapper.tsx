import React from "react"
import { useRecoilValue } from "recoil"
import { samplePackageState } from "@src/js/state/atom/sample_package_state"
import { Welcome } from "@src/js/component/welcome/welcome"
import { ViewerContainer } from "@src/js/component/ViewerContainer/viewer_container"
import styles from "./index.module.css"

export const AppWrapper: React.FC = () => {
    const currentSample = useRecoilValue(samplePackageState)
    return (
        <div className={styles.appWrapper}>
            {
                currentSample
                    ? <ViewerContainer />
                    : <Welcome />
            }
        </div>
    )
}
