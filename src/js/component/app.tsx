import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { RecoilRoot } from "recoil"
import { Window } from "./window/window"
import { Navigation } from "./navigation/navigation"
import { SampleListContainer } from "./sample_list/sample_list_container"
import { AppWrapper } from "./app_wrapper/app_wrapper"
import AppConfig from "@vender/app.config"
import styles from "./index.module.css"

const { Social, Footer, AppLogo, NavigationMessage } = AppConfig

type Props = {
}

export const App: React.FC<Props> = (arg) => {
    return (
        <>
            <RecoilRoot>
                <Window>
                    <Navigation message={NavigationMessage}></Navigation>
                    <Router>
                        <Switch>
                            <Route path="/">
                                <React.Suspense fallback={<></>}>
                                    <SampleListContainer ></SampleListContainer>
                                </React.Suspense>
                                <div className={styles.appWrapper}>
                                    <AppWrapper AppLogo={AppLogo} />
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