import { useRef, useCallback, MutableRefObject, MouseEventHandler, TouchEventHandler } from "react"

type ManageCanvasEventHandlers = (canvas: HTMLCanvasElement) => void

export const useCanvas = (addHandlers: ManageCanvasEventHandlers, removeHandlers: ManageCanvasEventHandlers) => {
    const canvasRef: MutableRefObject<HTMLCanvasElement> = useRef(null);

    const setRef = useCallback((node: HTMLCanvasElement | null) => {
        if (canvasRef.current) {
            // Make sure to cleanup any events/references added to the last instance
            removeHandlers(canvasRef.current)
        }

        if (node) {
            // Check if a node is actually passed. Otherwise node would be null.
            // You can now do what you need to, addEventListeners, measure, etc.
            addHandlers(node)
        }

        canvasRef.current = node
    }, [])

    return [setRef]
}
