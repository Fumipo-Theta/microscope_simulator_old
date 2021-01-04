import languageChangeHandler from "./languageChangeHandler.js"
import loadSampleList from "./load_sample_list.js"
import showSampleList from "./showSampleList.js"
import updateViewDescription from "./updateViewDescription.js"

export default function setLanguageSelectEventHandlers(state) {
    const languageSelector = document.querySelector("#language_selector")

    languageSelector.addEventListener("change",
        e => {
            languageChangeHandler(state)(e)
                .then(loadSampleList)
                .then(([state, response]) => showSampleList(state, response))
                .then(updateViewDescription)
        },
        false
    )
}
