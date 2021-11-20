import { I18nMap, Language } from "../type/entity"

export const withFallbackLanguage = (obj: I18nMap<string>, lang: Language, fallbackLang: Language = "en"): string => {
    return obj.hasOwnProperty(lang)
        ? obj[lang] !== ""
            ? obj[lang]
            : obj.hasOwnProperty(fallbackLang)
                ? obj[fallbackLang]
                : ""
        : obj.hasOwnProperty(fallbackLang)
            ? obj[fallbackLang]
            : ""
}