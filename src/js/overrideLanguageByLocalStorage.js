import { cacheStorage } from "./config/config.js"

export default function overwrideLanguageByLocalStorage(state) {
    const langInLocalStorage = cacheStorage.get("language")
    const lang = (langInLocalStorage !== undefined)
        ? langInLocalStorage
        : state.language;
    state.language = lang
    document.querySelector("option[value=" + lang + "]").selected = true
    return state
}
