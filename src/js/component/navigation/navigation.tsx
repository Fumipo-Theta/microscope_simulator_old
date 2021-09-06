import React, { useCallback, useState } from 'react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { Language } from '@src/js/type/entity'
import { systemLanguageState } from '@src/js/state/atom/system_language_state'
import { sampleListAppearanceState } from '@src/js/state/atom/sample_list_appearance_state'
import styles from "./index.module.css"

const SampleListExpander: React.FC = () => {
    const listIsActive = useRecoilValue(sampleListAppearanceState)
    const setSampleListAppearanceValue = useSetRecoilState(sampleListAppearanceState)
    const onClick = useCallback(
        (event: React.MouseEvent | React.TouchEvent) => {
            setSampleListAppearanceValue((prev) => !prev)
        },
        []
    )
    // TODO: Show sample name if one sample has been selected
    return (
        <div className={styles.sampleListExpanderContainer}>
            <button className={styles.expandSampleListButton} onClick={onClick}>
                {listIsActive ? "Close" : ">> Select sample <<"}
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