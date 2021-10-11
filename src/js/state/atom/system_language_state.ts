import { atom } from "recoil"
import { Language } from "@src/js/type/entity"
export const systemLanguageState = atom<Language>({
    key: 'systemLanguage',
    default: getSystemLanguage()
})

function getSystemLanguage(): Language {
    const language = (window.navigator.languages && window.navigator.languages[0]) ||
        window.navigator.language || "en"
    const languageShort = language.substr(0, 2)
    console.log(`[info] System language: ${languageShort}`)
    return languageShort as Language
}