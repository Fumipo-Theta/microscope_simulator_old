import * as React from 'react'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Language } from "@src/js/type/entity"
import { SampleListItem, SampleCategoryItemKeys, SampleList, SampleListKeys, SampleCategories, SampleCategoriesKeys, SampleListItemKeys } from "@src/js/type/sample"
import { sampleListAppearanceState } from '@src/js/state/atom/sample_list_appearance_state'
import { systemLanguageState } from '@src/js/state/atom/system_language_state'
import styles from "./index.module.css"

type Props = {
    sampleList: SampleList,
    sampleCategories: SampleCategories,
}

type BreadcrumbProps = {
    path: Array<string>
}

type SampleSelectorOptionProps = {
    item: SampleListItem,
    index: number,
    lang: Language,
    cached: boolean,
    sampleSelectedHandler: (v: SampleListItem[SampleListItemKeys.PackageName]) => (e: React.MouseEvent | React.TouchEvent) => void
}

interface SampleListSelectorProps extends SampleList {
    lang: Language
}

const onSampleSelected = (sample_id: SampleListItem[SampleListItemKeys.PackageName]) => (_e) => {
    console.log(sample_id)
}

const isSampleLocallyCached = (sampleListItem: SampleListItem, i: number) => {
    return i % 3 == 0 || i % 5 == 0
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ path }) => {
    return <div className={styles.breadcrumb}>
        {path.map((directory) => (<div key={directory}><span>{">"}</span><span>{directory}</span></div>))}
    </div>
}

const SampleCategoryContainer: React.FC<SampleCategories> = ({ [SampleCategoriesKeys.Categories]: sampleCategoryItems }) => {
    const currentPath = ["Rock", "Igneous rock"]
    const [isActive, updateActive] = useState(false)
    return <div className={styles.categoryContainer}>
        <div className={styles.categoryContainerMenuBar}>
            <Breadcrumb path={currentPath} />
            <button
                className={`${styles.toggleFilterButton} ${isActive ? styles.active : ""}`}
                onClick={(_) => { updateActive(!isActive) }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#eeeeff" color="#000000"><path d="M0 0h24v24H0z" fill="none"></path><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"></path></svg>
            </button>
        </div>
    </div>
}


const SampleSelectorOption: React.FC<SampleSelectorOptionProps> = ({ index, item, lang, cached, sampleSelectedHandler }) => {
    const cachedSymbol = cached ? "✔" : ""
    return (
        <div className={styles.optionContainer} onClick={sampleSelectedHandler(item[SampleListItemKeys.PackageName])}>
            <div className={styles.cachedSymbol}>{cachedSymbol}</div>
            <div className={styles.optionIndex}>{index}</div>
            <div className={styles.optionLabel}>
                {item[SampleListItemKeys.ListName][lang]}
            </div>
        </div>
    )
}

const SampleListSelector: React.FC<SampleListSelectorProps> = ({ [SampleListKeys.ListOfSample]: listOfSample, lang }) => {
    return <>
        {
            listOfSample.map((sampleListItem, i) => {
                return <SampleSelectorOption
                    key={sampleListItem[SampleListItemKeys.PackageName]}
                    index={i + 1}
                    item={sampleListItem}
                    lang={lang}
                    cached={isSampleLocallyCached(sampleListItem, i)}
                    sampleSelectedHandler={onSampleSelected} />
            })
        }
    </>
}

export const SampleListContainer: React.FC<Props> = ({ sampleList, sampleCategories }) => {
    const sampleListIsActive = useRecoilValue(sampleListAppearanceState)
    const currentLanguage = useRecoilValue(systemLanguageState)
    return <div className={`${styles.sampleListContainer} ${sampleListIsActive ? '' : styles.inActive}`}>
        <SampleCategoryContainer {...sampleCategories} />
        <SampleListSelector {...sampleList} lang={currentLanguage} />
    </div>
}