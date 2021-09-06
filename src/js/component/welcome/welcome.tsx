import React from "react"
import { AppLogo } from "../misc/app_logo/app_logo"

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

export const Welcome: React.FC = () => {
    return (<>
        <div id="welcome-card" style={welcomeCardStyle}>
            <div style={wrapperStyle}>
                <AppLogo />

                <p>Polarizing microscope simulator</p>

                {
                    es6Available()
                        ? <></>
                        : <div>
                            <p>Sorry, please use web browser below ...</p>
                            <p>I recomend the latest version of them.</p>
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