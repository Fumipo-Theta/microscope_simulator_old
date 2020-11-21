import languageChangeHandler from "./languageChangeHandler.js"
import sampleListLoader from "./loadSampleListFromRemote.js"
import updateViewDiscription from "./updateViewDiscription.js"

export default function setLanguageSelectEventHandlers(state) {
    const languageSelector = document.querySelector("#language_selector")

    languageSelector.addEventListener("change",
        e => languageChangeHandler(state)(e)
            .then(sampleListLoader)
            .then(updateViewDiscription),
        false
    )
}
