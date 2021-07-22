import { RootState } from "@src/js/type/entity"
import updateView from "./updateView"

export default function setToggleNicolEvents(state: RootState) {

    const toggleNicolButton = document.querySelector("#change_nicol") as HTMLInputElement
    const toggleNicolLabel = document.querySelector("#change_nicol + label")

    const toggleNicolHandler = (state: RootState) => new Promise((res, rej) => {
        toggleNicolButton.checked = state.viewerState.isCrossNicol
        state.viewerState.isCrossNicol = !state.viewerState.isCrossNicol;
        res(state)
    })

    toggleNicolButton.addEventListener(
        "click",
        e => { e.preventDefault() },
        false
    )


    toggleNicolLabel.addEventListener(
        "touch",
        e => { e.preventDefault() },
        false
    )

    toggleNicolButton.addEventListener(
        "touch",
        e => { e.preventDefault() },
        false
    )


    toggleNicolLabel.addEventListener(
        "mouseup",
        e => toggleNicolHandler(state)
            .then(updateView),
        false
    )

    toggleNicolLabel.addEventListener(
        "touchend",
        e => toggleNicolHandler(state)
            .then(updateView)
            .then(_ => {
                if (e.cancelable) {
                    e.preventDefault();
                }
            }),
        false
    )
}
