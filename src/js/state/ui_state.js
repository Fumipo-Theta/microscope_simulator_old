import SampleFilter from "../remote_repo/static/filter_by_category.js"
import { cacheStorage } from "../config/config.js"

function overrideLanguageByLocalStorage(systemLanguage) {
    const langInLocalStorage = cacheStorage.get("language")
    const lang = (langInLocalStorage !== undefined)
        ? langInLocalStorage
        : systemLanguage;
    document.querySelector("option[value=" + lang + "]").selected = true
    return lang
}

function getSystemLanguage() {
    const code = (window.navigator.languages && window.navigator.languages[0]) ||
        window.navigator.language ||
        window.navigator.userLanguage ||
        window.navigator.browserLanguage;

    const lang = code.match("ja") ? "ja" : "en";

    return lang
}

export const uiState = {
    "sampleFilter": new SampleFilter(),
    "storedKeys": [],
    "language": overrideLanguageByLocalStorage(getSystemLanguage()),
}