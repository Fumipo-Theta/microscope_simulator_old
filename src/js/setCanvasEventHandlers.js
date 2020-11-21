import { viewer } from "./viewer_canvas.js"
import { touchStartHandler, touchMoveHandler, touchEndHandler } from "./touchEventHandlers.js"
import { wheelHandler } from "./wheelEventHandler.js"

export default function setCanvasEventHandlers(state) {
    viewer.addEventListener(
        "mousedown",
        touchStartHandler(state),
        false
    )

    viewer.addEventListener(
        "dragstart",
        e => { e.preventDefault() },
        false
    )

    viewer.addEventListener(
        "drag",
        e => { e.preventDefault() },
        false
    )

    viewer.addEventListener(
        "dragend",
        e => { e.preventDefault() },
        false
    )



    viewer.addEventListener(
        "touchstart",
        touchStartHandler(state),
        false
    )

    viewer.addEventListener(
        "mousemove",
        touchMoveHandler(state),
        false
    )

    viewer.addEventListener(
        "touchmove",
        touchMoveHandler(state),
        false
    )

    viewer.addEventListener(
        "mouseup",
        touchEndHandler(state),
        false
    )

    viewer.addEventListener(
        "touchend",
        touchEndHandler(state),
        false
    )

    viewer.addEventListener(
        "wheel",
        wheelHandler(state),
        false
    )
}
