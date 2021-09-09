import * as React from 'react'
import { useState, useCallback, useEffect } from 'react'
import { useLocation } from "react-router-dom"
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { Language, PackageId, QueryParams } from "@src/js/type/entity"
import { SampleListItem, SampleList, SampleListKeys, SampleCategories, SampleCategoriesKeys, SampleListItemKeys } from "@src/js/type/sample"
import { sampleListAppearanceState } from '@src/js/state/atom/sample_list_appearance_state'
import { systemLanguageState } from '@src/js/state/atom/system_language_state'
import { selectedSampleListItemState } from '@src/js/state/atom/selected_sample_list_item_state'
import { sampleListNameState } from '@src/js/state/atom/sample_list_name_state'
import { sampleListSelector } from '@src/js/state/atom/sample_list_state'
import { SampleSelectorOption } from './sample_selector_option/sample_selector_option'
import styles from "./index.module.css"

type Props = {

}

type BreadcrumbProps = {
    path: Array<string>
}

interface SampleListSelectorProps extends SampleList {
    lang: Language
}

const isSampleLocallyCached = (sampleListItem: SampleListItem) => {
    return false
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

const SampleListSelector: React.FC<SampleListSelectorProps> = ({ [SampleListKeys.ListOfSample]: listOfSample, lang }) => {
    const location = useLocation()
    useEffect(() => {
        const preIndicatedSampleId = location.hash
        console.log(`[info] sampleId is indicated by hash: ${preIndicatedSampleId}`)
        if (listOfSample.length > 0 && preIndicatedSampleId && preIndicatedSampleId != '') {
            const currentItem = searchSampleListItem(listOfSample, preIndicatedSampleId.slice(1))
            setSelectedSampleListItemValue(currentItem)
            setSelectedSampleIndex(currentItem?.[SampleListItemKeys.GlobalIndex])
        }
    }, [listOfSample])

    const setSelectedSampleListItemValue = useSetRecoilState(selectedSampleListItemState)
    const setSampleListAppearanceValue = useSetRecoilState(sampleListAppearanceState)
    const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>()
    const onSampleSelected = useCallback((sample: SampleListItem, index) => {
        setSelectedSampleListItemValue(sample)
        setSelectedSampleIndex(index)
        setSampleListAppearanceValue(false)
        window.location.hash = sample[SampleListItemKeys.PackageName]
    }, [])

    return <div className={styles.sampleListSelector}>
        <div className={styles.sampleSelectorWrapper}>
            {
                listOfSample.map((sampleListItem) => {
                    return <SampleSelectorOption
                        key={sampleListItem[SampleListItemKeys.PackageName]}
                        index={sampleListItem.globalIndex}
                        item={sampleListItem}
                        lang={lang}
                        cached={isSampleLocallyCached(sampleListItem)}
                        isSelected={sampleListItem.globalIndex == selectedSampleIndex}
                        sampleSelectedHandler={onSampleSelected} />
                })
            }
        </div>
    </div>
}

export const SampleListContainer: React.FC<Props> = ({ }) => {
    const { sample_list, category } = parseQueryParams(location.search)
    const setSampleListNameValue = useSetRecoilState(sampleListNameState)
    useEffect(() => {
        setSampleListNameValue(sample_list)
    }, [sample_list])
    const sampleList = useRecoilValue(sampleListSelector)
    const sampleListIsActive = useRecoilValue(sampleListAppearanceState)
    const currentLanguage = useRecoilValue(systemLanguageState)

    const sampleCategories = { categories: [] }

    return <div className={`${styles.sampleListContainer} ${sampleListIsActive ? '' : styles.inActive}`}>
        <SampleCategoryContainer {...sampleCategories} />
        <SampleListSelector {...sampleList} lang={currentLanguage} />
    </div>
}

const parseQueryParams = (queryString): QueryParams => {
    return queryString.substring(1).split('&').map((p) => p.split('=')).reduce((obj, e) => ({ ...obj, [e[0]]: e[1] }), {});
}

const searchSampleListItem = (sampleList: SampleListItem[], sampleId: PackageId): SampleListItem | null => {
    const items = sampleList.filter(v => v[SampleListItemKeys.PackageName] == sampleId)
    return items.length > 0 ? items[0] : null
}