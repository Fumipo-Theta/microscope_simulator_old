import languageChangeHandler from "./languageChangeHandler.js"
import loadSampleList from "./load_sample_list.js"
import showSampleList from "./showSampleList.js"
import updateViewDescription from "./updateViewDescription.js"

function tee(value) {
    return (f) => {
        f(value)
        return value
    }
}

export default function setLanguageSelectEventHandlers(state) {
    const languageSelector = document.querySelector("#language_selector")

    languageSelector.addEventListener("change",
        e => {
            const newState = languageChangeHandler(state)(e)
            loadSampleList()
                .then(response => {
                    showSampleList(response["list_of_sample"], newState.language, newState.storedKeys)
                })
            updateViewDescription(newState)
        },
        false
    )
}
