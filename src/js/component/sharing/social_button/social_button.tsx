import React, { MouseEventHandler } from "react"
import { useLocation } from "react-router"
import styles from "./index.module.css"

type Props = {
    title: string,
    imgSrc: string,
    imgAlt: string,
    generateHref: (hash: string, description: string) => string
}

export const SocialButton: React.FC<Props> = ({ title, imgSrc, imgAlt, generateHref }) => {
    const location = useLocation()
    const href = generateHref(location.hash, title)
    const onClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
        const current = document.getElementById(title) as HTMLAnchorElement
        // TODO: Impl send telemetry to Google analytics
        window.open(current.href, '_blank', 'width=600, height=600, menubar=no, toolbar=no, scrollbars=yes');
        e.preventDefault();
    }
    return <>
        <div>
            <a id={title} href={href} target="_blank" title={title} onClick={onClick}>
                <img className={styles.snsIconImg} src={imgSrc} alt={imgAlt} />
            </a>
        </div>
    </>
}
