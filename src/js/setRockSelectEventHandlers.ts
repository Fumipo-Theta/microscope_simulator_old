import { RootState } from "@src/js/type/entity"
import rockNameSelectHandler from "./rockNameSelectHandler"
import updateView from "./updateView"
import { showErrorMessage, hideErrorMessage } from "./error_indicator_handler"
import { hideLoadingMessage } from "./loading_indicator_handler"

export default function setRockSelectEventHandlers(state: RootState) {
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
