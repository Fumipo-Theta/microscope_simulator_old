import * as React from 'react'
import { AppLogo } from '@vender/component/app_logo/app_logo'
import styles from "./index.module.css"
import { I18nMap } from '@src/js/type/entity'
import useLang from '@src/js/hooks/use_lang'
import { withFallbackLanguage } from '@src/js/util/language_util'

export interface AppDescriptionMessage {
    head1: I18nMap<string>,
    guideToPackageMaker: I18nMap<string>,
    announceCopyRight: I18nMap<string>,
    privacyPolicy: I18nMap<string>,
    sourceCodeAvailableAt: I18nMap<string>,
}

type AppDescriptionProps = {
    app_version: String,
    message: AppDescriptionMessage,
}


export const AppDescription: React.FC<AppDescriptionProps> = ({ app_version, message }) => {
    const [lang, _] = useLang()
    return (
        <>
            <AppLogo />
            <div className={styles.description}>
                <p>Version {app_version}</p>
                <h1>{withFallbackLanguage(message.head1, lang)}</h1>
                <p><a href="./make_package.html">{withFallbackLanguage(message.guideToPackageMaker, lang)}</a></p>

                <ul>
                    <li>{withFallbackLanguage(message.announceCopyRight, lang)}</li>
                    <li><a href="./about.html">{withFallbackLanguage(message.privacyPolicy, lang)}</a></li>
                    <li>{withFallbackLanguage(message.sourceCodeAvailableAt, lang)} <a
                        href="https://github.com/Fumipo-Theta/microscope_simulator/">GitHub</a></li>
                </ul>
            </div>
        </>
    )
}