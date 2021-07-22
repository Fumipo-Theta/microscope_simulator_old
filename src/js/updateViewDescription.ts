import { RootState } from "@src/js/type/entity"
import selectFromMultiLanguage from "./selectFromMultiLanguage"

export default function updateViewDescription(state: RootState) {
    const { uiState: { sampleMeta, language } } = state
    const { rockType, location, description, owner } = sampleMeta
    const descriptionBox = document.querySelector("#view_description")

    const rockFrom = `${selectFromMultiLanguage(rockType, language)} ${location ? "(" + selectFromMultiLanguage(location, language) + ")" : ""}`
    const rockDisc = selectFromMultiLanguage(description, language)
    const rockOwner = selectFromMultiLanguage(owner, language)

    const textTemplate = `<ul style="list-style-type:none;">
            <li>${rockFrom}</li>
            <li>${rockDisc}</li>
            <li>${rockOwner}</li>
        </ul>`

    descriptionBox.innerHTML = textTemplate;
    return state
}
