import * as React from 'react'
import { useState, useCallback, useEffect } from 'react'
import { useLocation } from "react-router-dom"
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { Language, PackageId, QueryParams } from "@src/js/type/entity"
import { SampleListItem, SampleList, SampleListKeys, SampleListItemKeys } from "@src/js/type/sample"
import { SampleCategoryContainer } from '../sample_filter/sample_filter'
import { sampleListAppearanceState } from '@src/js/state/atom/sample_list_appearance_state'
import { systemLanguageState } from '@src/js/state/atom/system_language_state'
import { selectedSampleListItemState } from '@src/js/state/atom/selected_sample_list_item_state'
import { sampleListNameState } from '@src/js/state/atom/sample_list_name_state'
import { sampleListSelector } from '@src/js/state/atom/sample_list_state'
import { SampleSelectorOption } from './sample_selector_option/sample_selector_option'
import styles from "./index.module.css"

type Props = {

}

interface SampleListSelectorProps extends SampleList {
    lang: Language
}

const isSampleLocallyCached = (sampleListItem: SampleListItem) => {
    return false
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