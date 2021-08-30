import React, { useCallback } from 'react'
import { useSetRecoilState } from 'recoil'
import { Language } from '@src/js/type/entity'
import { systemLanguageState } from '@src/js/state/atom/system_language_state'
import styles from "./index.module.css"

const SampleListExpander: React.FC = () => {
    return (
        <div>
            <button className={styles.expandSampleListButton}>
                {">>"} Select sample {"<<"}
            </button>
        </div>
    )
}

const SystemLanguageSelector: React.FC = () => {
    const setSystemLanguageValue = useSetRecoilState(systemLanguageState)
    const onChange = useCallback(
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedOptionIndex = event.target.options.selectedIndex
            console.log(selectedOptionIndex)
            console.log(event.target.options[selectedOptionIndex].value)
            setSystemLanguageValue(event.target.options[selectedOptionIndex].value as Language)
        },
        [setSystemLanguageValue]
    )
    return (
        <div>
            <select onChange={onChange}>
                <option defaultValue='ja'>日本</option>
                <option value='en'>ENG</option>
            </select>
        </div>
    )
}

export const Navigation: React.FC = () => {
    return (
        <div>
            <SampleListExpander />
            <SystemLanguageSelector />
        </div>
    )
}