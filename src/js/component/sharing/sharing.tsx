import React from "react"
import { SocialButton } from "./social_button/social_button"
import styles from "./index.module.css"

const myUrl = (hash) => `https://microscope.fumipo-theta.com/${hash}`

const snsMap = {
    twitter: {
        imgSrc: "/images/twitter-square-brands.svg",
        imgAlt: "twitter",
        title: "Share by Twitter",
        generateHref: (hash, desc) => `https://twitter.com/share?url=${encodeURIComponent(myUrl(hash))}`
    },
    facebook: {
        imgSrc: "/images/facebook-brands.svg",
        imgAlt: "facebook",
        title: "Share by Facebook",
        generateHref: (hash, desc) => `https://www.facebook.com/sharer/sharer.php?u=${myUrl(hash)}`
    },
    line: {
        imgSrc: "/images/line-brands.svg",
        imgAlt: "line",
        title: "Share by LINE",
        generateHref: (hash, desc) => `http://line.me/R/msg/text/?${encodeURIComponent("SCOPin rock" + " " + myUrl(hash))}`
    }
}
export const Sharing: React.FC = () => {
    return <div className={styles.wrapper}>
        {Object.values(snsMap).map(props => {
            return <SocialButton {...props} key={props.title} />
        })}
    </div>
}