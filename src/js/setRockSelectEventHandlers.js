import rockNameSelectHandler from "./rockNameSelectHandler.js"
import updateView from "./updateView.js"
import { showErrorMessage, hideErrorMessage } from "./error_indicator_handler.js"
import { hideLoadingMessage } from "./loading_indicator_handler.js"

export default function setRockSelectEventHandlers(state) {
    const rock_selector = document.querySelector("#rock_selector")

    rock_selector.addEventListener(
        "change",
        e => {
            rockNameSelectHandler(state)
                .then(updateView)
                .then(hideErrorMessage)
                .then(hideLoadingMessage)
                .catch(e => {
                    console.log("Sample cannot be loaded because of network error.")
                    showErrorMessage("Internet disconnected.")(e)
                })
        },
        false
    )
}
