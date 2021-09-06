import React, { useCallback } from "react"
import ReactDOM from "react-dom"
import { useLocation } from "react-router-dom"
import { Language } from "@src/js/type/entity"
import { SampleListItem, SampleListItemKeys } from "@src/js/type/sample"
import styles from "./index.module.css"

type SampleSelectorOptionProps = {
    item: SampleListItem,
    index: number,
    lang: Language,
    cached: boolean,
    sampleSelectedHandler: (v: SampleListItem[SampleListItemKeys.PackageName]) => void
}

export const SampleSelectorOption: React.FC<SampleSelectorOptionProps> = ({ index, item, lang, cached, sampleSelectedHandler }) => {
    const cachedSymbol = cached ? "" : ""
    const location = useLocation()
    const onClick = useCallback((e) => {
        sampleSelectedHandler(item[SampleListItemKeys.PackageName])
        location.hash = item[SampleListItemKeys.PackageName]
    }, [])
    return (
        <div className={styles.optionContainer} onClick={onClick}>
            <div className={styles.optionWrapper}>
                <div className={styles.cachedSymbol}>{cachedSymbol}</div>
                <div className={styles.optionIndex}>{index}</div>
                <div className={styles.optionLabel}>
                    {item[SampleListItemKeys.ListName][lang]}
                </div>
            </div>
        </div>
    )
}
