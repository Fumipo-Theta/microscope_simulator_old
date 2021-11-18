import React from "react"
import { ViewerContainer } from "@src/js/component/ViewerContainer/viewer_container"
import { ViewerContainerSuspend } from "@src/js/component/ViewerContainer/viewer_container_suspend"
import styles from "./index.module.css"

type Props = {
    AppLogo: React.FC
}

export const AppWrapper: React.FC<Props> = ({ AppLogo }) => {
    return (
        <div className={styles.appWrapper}>
            <React.Suspense fallback={<ViewerContainerSuspend />}>
                <ViewerContainer AppLogo={AppLogo} />
            </React.Suspense>
        </div>
    )
}
