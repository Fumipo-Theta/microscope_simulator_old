import React from "react"
import { useCanvas } from "@src/js/component/ViewerContainer/viewer/use_canvas"

export type CanvasProps = {
    width: number,
    height: number,
    addHandlers: (canvas: HTMLCanvasElement) => void,
    removeHandlers: (canvas: HTMLCanvasElement) => void,
}

const getMaxViewerSize = (windowWidth, windowHeight) => {
    const padding = 20 // px
    const navigationAndNicolHeight = 64 + 100 + 20 // px
    const width = windowWidth
    const height = windowHeight - navigationAndNicolHeight
    return (width < height ? width : height) - padding
}

export const Canvas: React.FC<CanvasProps> = ({ width, height, addHandlers, removeHandlers }) => {
    const viewerSize = getMaxViewerSize(width, height)
    const [ref] = useCanvas(addHandlers, removeHandlers)
    return <canvas ref={ref} width={viewerSize} height={viewerSize} />
}
