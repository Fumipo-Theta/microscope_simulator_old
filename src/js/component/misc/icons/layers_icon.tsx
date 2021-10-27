import React from "react"

type Props = {
    isActive: boolean,
}

const outlineStyleBase = {
    strokeWidth: 2,
    strokeDasharray: "none",
    strokeDashoffset: 0,
    strokeMiterlimit: 4,
    fillOpacity: 0,
    opacity: 1,
    stroke: "rgb(140,140,140)",
}

const outlineWithFillStyleBase = {
    ...outlineStyleBase,
    fillOpacity: 1,
    fill: "rgb(192,192,192)",
}

const outline = "M -34.68512 -26.45785 C -32.399879999999996 -30.857300000000002 -28.804219999999997 -34.43807 -24.395319999999998 -36.70504 L 85.09794000000001 -93.00437 L 85.09794000000001 -93.00437 C 87.32616 -94.15007999999999 90.03457 -93.76706999999999 91.85773 -92.04844999999999 C 93.68090000000001 -90.32981999999998 94.22298 -87.64871999999998 93.21068000000001 -85.35681 L 42.39727000000001 29.68901000000001 L 42.39727000000001 29.68901000000001 C 40.43601000000001 34.12947000000001 36.902670000000015 37.68831000000001 32.47642000000001 39.68144000000001 L -86.37418 93.19981000000001 L -86.37418 93.19981000000001 C -88.39470999999999 94.10965000000002 -90.76978 93.64021000000001 -92.29222 92.03007000000001 C -93.81466 90.41994000000001 -94.1505 88.02232000000001 -93.12904 86.05586000000001 z"

export const LayersIcon: React.FC<Props> = ({ isActive }) => {
    const strokeColor = isActive ? "#2196f3" : "rgb(140,140,140)"
    const outlineStyle = { ...outlineStyleBase, stroke: strokeColor }
    return <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" width="48" height="48" viewBox="0 0 48 48" xmlSpace="preserve">
        <desc>Created with Fabric.js 4.6.0</desc>
        <defs>
        </defs>
        <g transform="matrix(0.12 0.12 -0.12 0.12 23.92 34)" id="F9nnw24s43HqflCPJTG7A"  >
            <path style={outlineWithFillStyleBase} vectorEffect="non-scaling-stroke" transform=" translate(0, 0)" d={outline} strokeLinecap="round" />
        </g>
        <g transform="matrix(0.12 0.12 -0.12 0.12 23.92 25)" id="aUnAAgr4QtdcRSDhx6OTq"  >
            <path style={outlineStyle} vectorEffect="non-scaling-stroke" transform=" translate(0, 0)" d={outline} strokeLinecap="round" />
        </g>
        <g transform="matrix(0.12 0.12 -0.12 0.12 23.92 16)" id="ZHy9ixs5wSE218Hy4jojY"  >
            <path style={outlineStyle} vectorEffect="non-scaling-stroke" transform=" translate(0, 0)" d={outline} strokeLinecap="round" />
        </g>
    </svg>
}