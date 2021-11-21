import React from "react"
import { ViewerContainer } from "@src/js/component/ViewerContainer/viewer_container"
import { ViewerContainerSuspend } from "@src/js/component/ViewerContainer/viewer_container_suspend"
import styles from "./index.module.css"
import { IWelcomeMessage, IViewerContainerMessage } from "@src/js/type/message"

type Props = {
    AppLogo: React.FC,
    welcomeMessage: IWelcomeMessage,
    viewerContainerMessage: IViewerContainerMessage,
}

export const AppWrapper: React.FC<Props> = ({ AppLogo, welcomeMessage, viewerContainerMessage }) => {
    return (
        <div className={styles.appWrapper}>
            <React.Suspense fallback={<ViewerContainerSuspend />}>
                <ViewerContainer AppLogo={AppLogo} welcomeMessage={welcomeMessage} message={viewerContainerMessage} />
            </React.Suspense>
        </div>
    )
}
