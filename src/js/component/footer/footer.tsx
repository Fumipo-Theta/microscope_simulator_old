import * as React from 'react'

import Package from '../../../../package.json'
import { AppDescription } from './app_description/app_description'
import { ContactFormCard } from './contact_form/contact_form_card'
import { DonationFormCard } from './donation_form/donation_form_card'
import { TwitterTimeLine } from './twitter_timeline/twitter_timeline'
import styles from "./index.module.css"

type FooterProps = {}

export const Footer: React.FC<FooterProps> = (_props) => {
    const app_version = Package.version
    return (
        <div className={styles.footer}>
            <div className={styles.footer_column}>
                <AppDescription {...{ app_version }} />
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