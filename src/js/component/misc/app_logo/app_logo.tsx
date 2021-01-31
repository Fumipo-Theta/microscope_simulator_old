import * as React from 'react'

type AppLogoProps = {}

export const AppLogo: React.FC<AppLogoProps> = (_props) => {
    return (
        <div className="SCOPin_rock_logo">
            <span>SC</span>
            <svg viewBox="0 0 165 165">
                <use xlinkHref="#shadow-righttop"></use>
                <use xlinkHref="#shadow-leftbottom"></use>
                <use xlinkHref="#back-circle" opacity="1" fill="#000000" fill-opacity="1"></use>
                <use xlinkHref="#hexagon" opacity="1" fill="#ffffff" fill-opacity="1"></use>
            </svg >
            <span>P</span>
            <div>
                <div><span>in</span></div>
                <div><span>rock</span></div>
            </div>
        </div >
    )
}