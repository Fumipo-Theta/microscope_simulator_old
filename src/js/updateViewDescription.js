import selectFromMultiLanguage from "./selectFromMultiLanguage.js"

export default function updateViewDescription(state) {
    const descriptionBox = document.querySelector("#view_description")
    const lang = state.language

    const rockFrom = `${selectFromMultiLanguage(state.rockType, lang)} ${state.location ? "(" + selectFromMultiLanguage(state.location, lang) + ")" : ""}`
    const rockDisc = selectFromMultiLanguage(state.description, lang)
    const rockOwner = selectFromMultiLanguage(state.owner, lang)

    const textTemplate = `<ul style="list-style-type:none;">
            <li>${rockFrom}</li>
            <li>${rockDisc}</li>
            <li>${rockOwner}</li>
        </ul>`

    descriptionBox.innerHTML = textTemplate;
    return state
}
