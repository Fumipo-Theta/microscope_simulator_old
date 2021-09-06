import { selector } from "recoil"
import { Language } from "@src/js/type/entity"
import { systemLanguageState } from "@src/js/state/atom/system_language_state"

export const systemLanguageSelector = selector<Language>({
    key: "systemLanguageSelector",
    get: ({ get }) => {
        const currentLanguage: Language = get(systemLanguageState)
        return currentLanguage
    }
})
