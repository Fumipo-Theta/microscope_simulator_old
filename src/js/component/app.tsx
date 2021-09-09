import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { RecoilRoot } from "recoil"
import { Window } from "./window/window"
import { Navigation } from "./navigation/navigation"
import { SampleListContainer } from "./sample_list/sample_list_container"
import { AppWrapper } from "./app_wrapper/app_wrapper"
import { Sharing } from "./sharing/sharing"
import { Footer } from "./footer/footer"
import styles from "./index.module.css"

type Props = {
}

export const App: React.FC<Props> = (arg) => {
    return (
        <>
            <RecoilRoot>
                <Window>
                    <Navigation></Navigation>
                    <Router>
                        <Switch>
                            <Route path="/">
                                <React.Suspense fallback={<></>}>
                                    <SampleListContainer ></SampleListContainer>
                                </React.Suspense>
                                <div className={styles.appWrapper}>
                                    <AppWrapper />
                                    <Sharing />
                                </div>
                            </Route>
                        </Switch>
                    </Router>
                </Window>
            </RecoilRoot>
            <Footer />
        </>
    )
}