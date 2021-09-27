import React, { useCallback, useState } from 'react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { Language } from '@src/js/type/entity'
import { systemLanguageState } from '@src/js/state/atom/system_language_state'
import { selectedSampleListItemState } from '@src/js/state/atom/selected_sample_list_item_state'
import { sampleListAppearanceState } from '@src/js/state/atom/sample_list_appearance_state'
import styles from "./index.module.css"
import { SampleListItemKeys } from '@src/js/type/sample'

const SampleListExpander: React.FC = () => {
    const listIsActive = useRecoilValue(sampleListAppearanceState)
    const setSampleListAppearanceValue = useSetRecoilState(sampleListAppearanceState)
    const onClick = useCallback(
        (event: React.MouseEvent | React.TouchEvent) => {
            setSampleListAppearanceValue((prev) => !prev)
        },
        []
    )
    const currentLang = useRecoilValue(systemLanguageState)
    const currentListItem = useRecoilValue(selectedSampleListItemState)
    const currentLitItemIndex = currentListItem?.[SampleListItemKeys.GlobalIndex] || ''
    const buttonWord = currentListItem?.[SampleListItemKeys.ListName]?.[currentLang] || "Select sample"

    return (
        <div className={`${styles.sampleListExpanderContainer}  ${listIsActive ? styles.activeButton : ""}`}>
            <button className={`${styles.expandSampleListButton}`} onClick={onClick}>
                {listIsActive ? ">> Close <<" : `${currentLitItemIndex} ${buttonWord}`}
            </button>
        </div>
    )
}

const SystemLanguageSelector: React.FC = () => {
    const setSystemLanguageValue = useSetRecoilState(systemLanguageState)
    const onChange = useCallback(
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedOptionIndex = event.target.options.selectedIndex
            setSystemLanguageValue(event.target.options[selectedOptionIndex].value as Language)
        },
        []
    )
    return (
        <div className={styles.languageSelectorContainer}>
            <select onChange={onChange} className={styles.languageSelector}>
                <option defaultValue='ja' value='ja'>日本</option>
                <option value='en'>ENG</option>
            </select>
        </div>
    )
}

export const Navigation: React.FC = () => {
    return (
        <>
            <div className={styles.navigationContainer}>
                <div className={styles.wrapper}>
                    <SampleListExpander />
                    <SystemLanguageSelector />
                </div>
            </div>
            <div className={styles.navigationSpace}></div>
        </>
    )
}