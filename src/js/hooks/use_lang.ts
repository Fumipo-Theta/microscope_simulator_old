import { SetterOrUpdater, useRecoilValue, useSetRecoilState } from "recoil"
import { Language } from "../type/entity"
import { systemLanguageState } from "../state/atom/system_language_state"

const useLang = (): [Language, SetterOrUpdater<Language>] => {
    const current = useRecoilValue(systemLanguageState)
    const setLang = useSetRecoilState(systemLanguageState)
    return [current, setLang]
}

export default useLang
