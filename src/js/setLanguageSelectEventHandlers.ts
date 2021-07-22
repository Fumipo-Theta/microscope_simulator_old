import { Language, RootState } from "@src/js/type/entity"
import updateSampleList from "@src/js/usecase/update_sample_list"
import updateViewDescription from "./updateViewDescription"
import { cacheStorage } from "@src/js/config/config"
import generateCategorySelector from "./category_selector/generate_category"

function languageChangeHandler(state: RootState) {
    return function (e) {
        const languageSelector = document.querySelector("#language_selector") as HTMLSelectElement
        const lang = languageSelector.options[languageSelector.selectedIndex].value as Language;
        state.uiState.language = lang
        cacheStorage.put("language", lang)
        return state
    }
}


export default function setLanguageSelectEventHandlers(state: RootState) {
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
