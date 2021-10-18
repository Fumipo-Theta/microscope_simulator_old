import React from "react"

type Props = {
    text: string,
    top: number,
    left: number,
    rotate: number,
    toBeShown: boolean,
    color: string,
}

export const Annotation: React.FC<Props> = ({ text, top, left, rotate, toBeShown, color }) => {
    const dynamicStyle = {
        top: top,
        left: left,
        transform: `rotate(${rotate}deg)`,
        transformOrigin: "left top",
        opacity: toBeShown ? 100 : 0,
        color: color,
    }
    const style = {
        width: "fit-content",
    }
    return <div style={{ position: "absolute", ...style, ...dynamicStyle }}><Icon color={color} /></div>
}

const Icon: React.FC<{ color: string }> = ({ color }) => {
    return <svg style={{ width: "2rem", height: "2rem", verticalAlign: "middle", fill: color, overflow: "hidden" }} viewBox="0 0 854 854" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path d="M 426.389 106.781 C 402.834 106.781 363.564 123.504 363.564 147.058 L 363.564 333.751 C 363.564 366.583 406.726 380.785 429.319 380.774 C 455.794 380.761 492.18 353.735 492.18 338.498 L 492.18 151.805 C 492.18 128.251 449.944 106.781 426.389 106.781 Z M 725.532 0.482 L 128.432 0.482 C 57.768 0.482 0.482 57.768 0.482 128.432 L 0.482 554.932 C 0.482 625.596 57.768 682.882 128.432 682.882 L 622.745 682.882 L 780.55 841.112 C 788.599 849.096 799.495 853.547 810.832 853.482 C 816.426 853.625 821.978 852.458 827.038 850.069 C 842.965 843.527 853.396 828.05 853.482 810.832 L 853.482 128.432 C 853.482 57.768 796.196 0.482 725.532 0.482 Z M 393.16 451.15 C 363.073 465.245 357.015 512.799 369.872 538.265 C 382.729 563.731 433.615 585.846 468.665 559.034 C 502.891 532.853 501.188 494.413 488.026 473.032 C 469.505 442.945 427.845 434.901 393.16 451.15 Z" style={{ fill: color, fillRule: "evenodd" }} transform={"matrix(-1, 0, 0, -1, 854, 854)"} />
    </svg>
}