export default function languageChangeHandler(state) {
    return function (e) {
        return new Promise((res, rej) => {
            const languageSelector = document.querySelector("#language_selector")
            const lang = languageSelector.options[languageSelector.selectedIndex].value;
            state.language = lang
            state.localStorage.put("language", lang)
            res(state)
        })
    }
}
