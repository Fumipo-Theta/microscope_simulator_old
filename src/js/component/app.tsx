import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { RecoilRoot } from "recoil"
import { Window } from "./window/window"
import { Navigation } from "./navigation/navigation"
import { SampleListContainer } from "./sample_list/sample_list_container"
import { AppWrapper } from "./app_wrapper/app_wrapper"
import AppConfig from "@vender/app.config"
import styles from "./index.module.css"

const {
    Social,
    Footer,
    AppLogo,
    navigationMessage,
    welcomeMessage,
    viewerContainerMessage,
    sampleListMessage,
} = AppConfig

console.log(welcomeMessage)
type Props = {
}

export const App: React.FC<Props> = (arg) => {
    return (
        <>
            <RecoilRoot>
                <Window>
                    <Navigation message={navigationMessage}></Navigation>
                    <Router>
                        <Switch>
                            <Route path="/">
                                <React.Suspense fallback={<></>}>
                                    <SampleListContainer message={sampleListMessage} ></SampleListContainer>
                                </React.Suspense>
                                <div className={styles.appWrapper}>
                                    <AppWrapper AppLogo={AppLogo} welcomeMessage={welcomeMessage} viewerContainerMessage={viewerContainerMessage} />
                                    <Social />
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