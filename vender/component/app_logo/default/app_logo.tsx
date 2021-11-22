import * as React from 'react'

type AppLogoProps = {}

const style = `
.SCOPin_rock_logo {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial;
  font-size: var(--logo-font-size);
}
.SCOPin_rock_logo > svg {
    width: 1em;
    height: 1em;
}
  
  
.SCOPin_rock_logo > svg:hover,
.SCOPin_rock_logo > svg:active {
    transform: rotate(360deg);
    transition: all 0.5s;
}
  
.SCOPin_rock_logo > span {
      font-size: 1em;
      color: #2196f3;
}
  
  
.SCOPin_rock_logo > div > div:nth-child(1) {
      position: relative;
      top: 0;
      left: 0;
      font-size: 0.66em;
      color: #2196f3
}
  
.SCOPin_rock_logo > div > div:nth-child(2) {
      position: relative;
      top: calc(-0.45em);
      left: calc(-0.9em);
      font-size: 0.4em;
      font-weight: bold;
      color: #c000ff;
}

@media screen and (max-width: 400px) {
    .SCOPin_rock_logo {
        font-size: calc(300px / 5);
    }
}

@media screen and (max-width: 800px) {
    .SCOPin_rock_logo {
        font-size: calc(400px / 5);
    }
}

@media screen and (min-width: 801px) {
    .SCOPin_rock_logo {
        font-size: calc(600px / 5);
    }
}
`

const AppLogo: React.FC<AppLogoProps> = (_props) => {
    return (
        <>
            <style>{style}</style>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                preserveAspectRatio="xMidYMid meet" width="0" height="0">
                <defs>
                    <path
                        d="M160.1 82.5C160.1 125.33 125.33 160.1 82.5 160.1C39.67 160.1 4.9 125.33 4.9 82.5C4.9 39.67 39.67 4.9 82.5 4.9C125.33 4.9 160.1 39.67 160.1 82.5Z"
                        id="back-circle"></path>
                    <path
                        d="M147.47 82.5C147.47 118.36 118.36 147.47 82.5 147.47C46.64 147.47 17.53 118.36 17.53 82.5C17.53 46.64 46.64 17.53 82.5 17.53C118.36 17.53 147.47 46.64 147.47 82.5Z"
                        id="b3YNo8TemI"></path>
                    <path d="M82.5 27.31L32.69 54.9L32.69 110.1L82.5 137.69L132.31 110.1L132.31 54.9L82.5 27.31Z" id="hexagon">
                    </path>

                    <g id="shadow-righttop">
                        <filter id="shadow15869114" x="-17.1" y="-17.1" width="201.2" height="201.2"
                            filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse">
                            <feFlood></feFlood>
                            <feComposite in2="SourceAlpha" operator="in"></feComposite>
                            <feGaussianBlur stdDeviation="2.65"></feGaussianBlur>
                            <feOffset dx="2" dy="-2" result="afterOffset"></feOffset>
                            <feFlood floodColor="#008cff" floodOpacity="0.69"></feFlood>
                            <feComposite in2="afterOffset" operator="in"></feComposite>
                            <feMorphology operator="dilate" radius="1"></feMorphology>
                            <feComposite in2="SourceAlpha" operator="out"></feComposite>
                        </filter>
                        <path
                            d="M160.1 82.5C160.1 125.33 125.33 160.1 82.5 160.1C39.67 160.1 4.9 125.33 4.9 82.5C4.9 39.67 39.67 4.9 82.5 4.9C125.33 4.9 160.1 39.67 160.1 82.5Z"
                            id="bfEYO4Zok" fill="white" fillOpacity="1" filter="url(#shadow15869114)">
                        </path>
                    </g>
                    <g id="shadow-leftbottom">
                        <filter id="shadow11909372" x="-17.1" y="-17.1" width="201.2" height="201.2"
                            filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse">
                            <feFlood></feFlood>
                            <feComposite in2="SourceAlpha" operator="in"></feComposite>
                            <feGaussianBlur stdDeviation="2.65"></feGaussianBlur>
                            <feOffset dx="-2" dy="2" result="afterOffset"></feOffset>
                            <feFlood floodColor="#c000ff" floodOpacity="0.69"></feFlood>
                            <feComposite in2="afterOffset" operator="in"></feComposite>
                            <feMorphology operator="dilate" radius="1"></feMorphology>
                            <feComposite in2="SourceAlpha" operator="out"></feComposite>
                        </filter>
                        <path
                            d="M160.1 82.5C160.1 125.33 125.33 160.1 82.5 160.1C39.67 160.1 4.9 125.33 4.9 82.5C4.9 39.67 39.67 4.9 82.5 4.9C125.33 4.9 160.1 39.67 160.1 82.5Z"
                            id="a3bgK3J7G" fill="white" fillOpacity="1" filter="url(#shadow11909372)">
                        </path>
                    </g>
                </defs>
            </svg>
            <div className="SCOPin_rock_logo">
                <span>SC</span>
                <svg viewBox="0 0 165 165">
                    <use xlinkHref="#shadow-righttop"></use>
                    <use xlinkHref="#shadow-leftbottom"></use>
                    <use xlinkHref="#back-circle" opacity="1" fill="#000000" fillOpacity="1"></use>
                    <use xlinkHref="#hexagon" opacity="1" fill="#ffffff" fillOpacity="1"></use>
                </svg >
                <span>P</span>
                <div>
                    <div><span>in</span></div>
                    <div><span>rock</span></div>
                </div>
            </div>
        </>
    )
}

export default AppLogo
