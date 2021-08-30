import { UiState } from "@src/js/type/entity";
import SampleFilter from "@src/js/remote_repo/static/filter_by_category"
import { cacheStorage } from "@src/js/config/config"

function overrideLanguageByLocalStorage(systemLanguage) {
    const langInLocalStorage = cacheStorage.get("language")
    const lang = (langInLocalStorage !== undefined)
        ? langInLocalStorage
        : systemLanguage;
    const selectedOption = document.querySelector("option[value=" + lang + "]") as HTMLOptionElement
    if (selectedOption) selectedOption.selected = true
    return lang
}

function getSystemLanguage() {
    const navigator: Navigator = window.navigator
    const code = (navigator.languages && navigator.languages[0]) ||
        navigator.language

    const lang = code.match("ja") ? "ja" : "en";

    return lang
}

export const uiState: UiState = {
    sampleFilter: new SampleFilter(),
    storedKeys: [],
    language: overrideLanguageByLocalStorage(getSystemLanguage()),
    samplePackage: {}
}
