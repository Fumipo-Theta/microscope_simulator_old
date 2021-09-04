import React from "react"
import { RecoilRoot } from "recoil"
import { Window } from "./window/window"
import { Navigation } from "./navigation/navigation"
import { SampleListContainer } from "./sample_list/sample_list_container"
import { ViewerContainer } from "./ViewerContainer/viewer_container"
import { Footer } from "./footer/footer"
import { SampleList, SampleCategories } from "@src/js/type/sample"
import styles from "./index.module.css"

type Props = {
    sampleList: SampleList,
    sampleCategories: SampleCategories,
}

export const App: React.FC<Props> = (arg) => {
    return (
        <RecoilRoot>
            <React.Suspense fallback={<div>Loading...</div>}>
                <Window>
                    <Navigation></Navigation>
                    <SampleListContainer {...arg}></SampleListContainer>
                    <div className={styles.appWrapper}>
                        <ViewerContainer />
                    </div>

                </Window>
            </React.Suspense>
        </RecoilRoot>
    )
}