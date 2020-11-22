import languageChangeHandler from "./languageChangeHandler.js"
import sampleListLoader from "./loadSampleListFromRemote.js"
import updateViewDescription from "./updateViewDescription.js"

export default function setLanguageSelectEventHandlers(state) {
    const languageSelector = document.querySelector("#language_selector")

    languageSelector.addEventListener("change",
        e => languageChangeHandler(state)(e)
            .then(sampleListLoader)
            .then(updateViewDescription),
        false
    )
}
