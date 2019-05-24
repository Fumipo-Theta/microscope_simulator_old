/**
 *
 * @param {String,Object[String,String]} multiLanguageTextObj
 * @return {String}
 */
export default function selectFromMultiLanguage(multiLanguageTextObj, languageCode) {
    if (typeof (multiLanguageTextObj) === "string") {
        return multiLanguageTextObj
    } else if (typeof (multiLanguageTextObj) === "object") {
        if (multiLanguageTextObj.hasOwnProperty(languageCode)) {
            return multiLanguageTextObj[languageCode]
        } else {
            const keys = Object.keys(multiLanguageTextObj)
            return (keys.length > 0)
                ? multiLanguageTextObj[keys[0]]
                : ""
        }
    } else {
        return ""
    }
}
