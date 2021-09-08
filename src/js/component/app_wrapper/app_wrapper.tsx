import React from "react"
import { ViewerContainer } from "@src/js/component/ViewerContainer/viewer_container"
import { ViewerContainerSuspend } from "@src/js/component/ViewerContainer/viewer_container_suspend"
import styles from "./index.module.css"

export const AppWrapper: React.FC = () => {
    return (
        <div className={styles.appWrapper}>
            <React.Suspense fallback={<ViewerContainerSuspend />}>
                <ViewerContainer />
            </React.Suspense>
        </div>
    )
}
