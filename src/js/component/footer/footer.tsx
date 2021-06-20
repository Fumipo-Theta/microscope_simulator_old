import * as React from 'react'

import { version } from '../../../../package.json'
import { AppDescription } from './app_description/app_description'
import { ContactFormCard } from './contact_form/contact_form_card'
import { DonationFormCard } from './donation_form/donation_form_card'
import { TwitterTimeLine } from './twitter_timeline/twitter_timeline'

type FooterProps = {}

export const Footer: React.FC<FooterProps> = (_props) => {
    const app_version = version
    return (
        <>
            <div className="footer_column">
                <AppDescription {...{ app_version }} />
            </div>
            <div className="footer_column">
                <TwitterTimeLine />
            </div>
            <div className="footer_column">
                <ContactFormCard />
                <DonationFormCard />
            </div>
        </>
    )
}