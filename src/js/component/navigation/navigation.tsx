import React, { useCallback } from 'react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { Language } from '@src/js/type/entity'
import { INavigationMessage } from '@src/js/type/message'
import { selectedSampleListItemState } from '@src/js/state/atom/selected_sample_list_item_state'
import { sampleListAppearanceState } from '@src/js/state/atom/sample_list_appearance_state'
import useLang from '@src/js/hooks/use_lang'
import styles from "./index.module.css"
import { SampleListItemKeys } from '@src/js/type/sample'
import { withFallbackLanguage } from '@src/js/util/language_util'

type ExpanderProps = {
    message: INavigationMessage
}

const SampleListExpander: React.FC<ExpanderProps> = ({ message }) => {
    const listIsActive = useRecoilValue(sampleListAppearanceState)
    const setSampleListAppearanceValue = useSetRecoilState(sampleListAppearanceState)
    const onClick = useCallback(
        (_event: React.MouseEvent | React.TouchEvent) => {
            setSampleListAppearanceValue((prev) => !prev)
        },
        []
    )
    const [lang, _] = useLang()
    const currentListItem = useRecoilValue(selectedSampleListItemState)
    const currentLitItemIndex = currentListItem?.[SampleListItemKeys.GlobalIndex] || ''
    const buttonWord = currentListItem?.[SampleListItemKeys.ListName]?.[lang] || withFallbackLanguage(message.showSampleList, lang, "en")

    return (
        <div className={`${styles.sampleListExpanderContainer}  ${listIsActive ? styles.activeButton : ""}`}>
            <button className={`${styles.expandSampleListButton}`} onClick={onClick}>
                {listIsActive ? withFallbackLanguage(message.hideSampleList, lang, "en") : `${currentLitItemIndex} ${buttonWord}`}
            </button>
        </div>
    )
}

const SystemLanguageSelector: React.FC = () => {
    const [currentLang, setLang] = useLang()
    const onChange = useCallback(
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedOptionIndex = event.target.options.selectedIndex
            setLang(event.target.options[selectedOptionIndex].value as Language)
        },
        [setLang]
    )
    return (
        <div className={styles.languageSelectorContainer}>
            <select onChange={onChange} className={styles.languageSelector}>
                {
                    currentLang == 'ja'
                        ? <>
                            <option defaultValue='ja' value='ja'>日本</option>
                            <option value='en'>ENG</option>
                        </>
                        : <>
                            <option value='ja'>日本</option>
                            <option defaultValue='en' value='en'>ENG</option>
                        </>
                }
            </select>
        </div>
    )
}

type Props = {
    message: INavigationMessage
}

export const Navigation: React.FC<Props> = ({ message }) => {
    return (
        <>
            <div className={styles.navigationContainer}>
                <div className={styles.wrapper}>
                    <SampleListExpander message={message} />
                    <SystemLanguageSelector />
                </div>
            </div>
            <div className={styles.navigationSpace}></div>
        </>
    )
}