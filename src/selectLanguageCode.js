export default function selectLanguageCode() {
    const code = (window.navigator.languages && window.navigator.languages[0]) ||
        window.navigator.language ||
        window.navigator.userLanguage ||
        window.navigator.browserLanguage;

    const lang = code.match("ja") ? "ja" : "en";

    return lang
}
