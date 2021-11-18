import * as React from 'react'
import { AppLogo } from '@vender/component/app_logo/app_logo'
import styles from "./index.module.css"

type AppDescriptionProps = {
    app_version: String,
}

export const AppDescription: React.FC<AppDescriptionProps> = ({ app_version }) => {
    return (
        <>
            <AppLogo />
            <div className={styles.description}>
                <p>Version {app_version}</p>
                <h1>Polarization microscope simulator, SCOPin rock !</h1>
                <p><a href="./make_package.html">Create microscope images package</a></p>

                <ul>
                    <li>This page and all contents are made by Fumipo Theta.
                        Please do not copy, modify, and repost any contents without telling me.</li>
                    <li><a href="./about.html">Privacy policy</a></li>
                    <li>Source code is available at <a
                        href="https://github.com/Fumipo-Theta/microscope_simulator/">GitHub</a></li>
                </ul>
            </div>
        </>
    )
}