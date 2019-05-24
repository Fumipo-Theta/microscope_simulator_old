export default function overwrideLanguageByLocalStorage(state) {
    const langInLocalStorage = state.localStorage.get("language")
    const lang = (langInLocalStorage !== undefined)
        ? langInLocalStorage
        : state.language;
    state.language = lang
    document.querySelector("option[value=" + lang + "]").selected = true
    return state
}
