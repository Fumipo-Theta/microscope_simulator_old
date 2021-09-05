import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
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
            <Router>
                <React.Suspense fallback={<div>Loading...</div>}>
                    <Window>
                        <Navigation></Navigation>
                        <Switch>
                            <Route path="/">
                                <SampleListContainer {...arg}></SampleListContainer>
                                <div className={styles.appWrapper}>
                                    <ViewerContainer />
                                </div>
                            </Route>
                        </Switch>
                    </Window>
                </React.Suspense>
            </Router>
        </RecoilRoot>
    )
}