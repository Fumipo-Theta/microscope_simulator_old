import * as React from 'react'

import Package from '../../../../package.json'
import { AppDescription } from './app_description/app_description'
import { ContactFormCard } from './contact_form/contact_form_card'
import { TwitterTimeLine } from './twitter_timeline/twitter_timeline'
import styles from "./index.module.css"
import type { AppDescriptionMessage } from "./app_description/app_description"

interface IFooterMessage extends AppDescriptionMessage {

}

type FooterProps = {}

const message: IFooterMessage = {
    head1: { ja: "偏光顕微鏡観察シミュレーター SCOPin rock!", en: "Polarization microscope simulator, SCOPin rock!" },
    guideToPackageMaker: { ja: "薄片画像パッケージ作成はこちら (運営向け)", "en": "Create microscope images package" },
    announceCopyRight: {
        ja: "このアプリと全てのコンテンツは Fumipo Theta が制作しています。Fumipo Thetaの許可なくアプリやコンテンツの複製・改変・再配布することを禁じます。",
        en: "This application and all contents are made by Fumipo Theta. Please do not copy, modify, and repost any contents without telling me."
    },
    privacyPolicy: { ja: "プライバシーポリシー", en: "Privacy policy" },
    sourceCodeAvailableAt: { ja: "ソースコード公開場所: ", en: "Source code is available at" }
}

export const Footer: React.FC<FooterProps> = (_) => {
    const app_version = Package.version
    return (
        <div className={styles.footer}>
            <div className={styles.footer_column}>
                <AppDescription {...{ app_version }} message={message} />
            </div>
            <div className={styles.footer_column}>
                <TwitterTimeLine />
            </div>
            <div className={styles.footer_column}>
                <ContactFormCard />
            </div>
        </div>
    )
}