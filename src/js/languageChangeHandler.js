import { cacheStorage } from "./config/config.js"

export default function languageChangeHandler(state) {
    return function (e) {
        const languageSelector = document.querySelector("#language_selector")
        const lang = languageSelector.options[languageSelector.selectedIndex].value;
        state.language = lang
        cacheStorage.put("language", lang)
        return state
    }
}
