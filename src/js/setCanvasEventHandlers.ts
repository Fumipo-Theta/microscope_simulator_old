import { RootState } from "@src/js/type/entity"
import { viewer } from "./viewer_canvas"
import { touchStartHandler, touchMoveHandler, touchEndHandler } from "./touchEventHandlers"
import { wheelHandler } from "./wheelEventHandler"

export default function setCanvasEventHandlers(state: RootState) {
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
