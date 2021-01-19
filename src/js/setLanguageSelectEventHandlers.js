import updateSampleList from "./usecase/update_sample_list.js"
import updateViewDescription from "./updateViewDescription.js"
import { cacheStorage } from "./config/config.js"
import generateCategorySelector from "./category_selector/generate_category.js"

function languageChangeHandler(state) {
    return function (e) {
        const languageSelector = document.querySelector("#language_selector")
        const lang = languageSelector.options[languageSelector.selectedIndex].value;
        state.uiState.language = lang
        cacheStorage.put("language", lang)
        return state
    }
}


export default function setLanguageSelectEventHandlers(state) {
    const languageSelector = document.querySelector("#language_selector")

    languageSelector.addEventListener("change",
        async e => {
            let newState = languageChangeHandler(state)(e)
            newState = await generateCategorySelector(
                document.querySelector("#wrapper-category_selector"),
                newState
            )
            const uiState = newState.uiState
            updateSampleList(uiState.language, uiState.storedKeys, uiState.sampleFilter)
            updateViewDescription(newState)
        },
        false
    )
}
