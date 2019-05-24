import selectFromMultiLanguage from "./selectFromMultiLanguage.js"

export default function updateViewDiscription(state) {
    const discriptionBox = document.querySelector("#view_discription")
    const lang = state.language

    const rockFrom = `${selectFromMultiLanguage(state.rockType, lang)} ${state.location ? "(" + selectFromMultiLanguage(state.location, lang) + ")" : ""}`
    const rockDisc = selectFromMultiLanguage(state.discription, lang)
    const rockOwner = selectFromMultiLanguage(state.owner, lang)

    const textTemplate = `<ul style="list-style-type:none;">
            <li>${rockFrom}</li>
            <li>${rockDisc}</li>
            <li>${rockOwner}</li>
        </ul>`

    discriptionBox.innerHTML = textTemplate;
    return state
}
