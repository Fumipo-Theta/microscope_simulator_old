import { IWelcomeMessage } from "@src/js/type/message"
import React from "react"
import { withFallbackLanguage } from "@src/js/util/language_util"
import useLang from "@src/js/hooks/use_lang"

const welcomeCardStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
}

const wrapperStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
}

type Props = {
    AppLogo: React.FC,
    message: IWelcomeMessage,
}

export const Welcome: React.FC<Props> = ({ AppLogo, message }) => {
    const [lang, _] = useLang()
    return (<>
        <div id="welcome-card" style={welcomeCardStyle}>
            <div style={wrapperStyle}>
                <AppLogo />

                <p>{withFallbackLanguage(message.appDescription, lang)}</p>

                {
                    es6Available()
                        ? <></>
                        : <div>
                            <p>{withFallbackLanguage(message.recommendUseModernBrowser, lang)}</p>
                            <p>{withFallbackLanguage(message.recommendLatestBrowserVersion, lang)}</p>
                            <ul>
                                <li>Google Chrome (version 45~) </li>
                                <li>Safari (version 10~)</li>
                                <li>Firefox (version 22~)</li>
                            </ul>
                        </div>
                }
            </div>
        </div>
    </>
    )
}

function es6Available() {
    return (typeof Symbol === "function" && typeof Symbol() === "symbol")
}