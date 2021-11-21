import * as React from 'react'

import Package from '../../../../package.json'
import { AppDescription } from './app_description/app_description'
import { ContactFormCard } from './contact_form/contact_form_card'
import { TwitterTimeLine } from './twitter_timeline/twitter_timeline'
import styles from "./index.module.css"
import { appDescriptionMessage, contactFormMessage } from '@vender/i18n/custom_component_message'

type FooterProps = {}

export const Footer: React.FC<FooterProps> = (_) => {
    const app_version = Package.version
    return (
        <div className={styles.footer}>
            <div className={styles.footer_column}>
                <AppDescription {...{ app_version }} message={appDescriptionMessage} />
            </div>
            <div className={styles.footer_column}>
                <TwitterTimeLine />
            </div>
            <div className={styles.footer_column}>
                <ContactFormCard message={contactFormMessage} />
            </div>
        </div>
    )
}