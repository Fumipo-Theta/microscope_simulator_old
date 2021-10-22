import { useRef, useCallback, MutableRefObject, MouseEventHandler, TouchEventHandler } from "react"

type ManageCanvasEventHandlers = (canvas: HTMLCanvasElement) => void

export const useCanvas = () => {
    const canvasRef: MutableRefObject<HTMLCanvasElement> = useRef(null);

    const setRef = useCallback((node: HTMLCanvasElement | null) => {
        if (canvasRef.current) {
            // Make sure to cleanup any events/references added to the last instance
        }

        if (node) {
            // Check if a node is actually passed. Otherwise node would be null.
            // You can now do what you need to, addEventListeners, measure, etc.
        }

        canvasRef.current = node
    }, [])

    return [canvasRef, setRef]
}
