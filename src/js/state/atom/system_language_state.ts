import { atom } from "recoil"
import { Language } from "@src/js/type/entity"
export const systemLanguageState = atom<Language>({
    key: 'systemLanguage',
    default: 'ja'
})