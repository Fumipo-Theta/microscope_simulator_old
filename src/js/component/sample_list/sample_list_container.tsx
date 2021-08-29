import * as React from 'react'
import { Language } from "@src/js/type/entity"
import { SampleListItem, SampleCategoryItemKeys, SampleList, SampleListKeys, SampleCategories, SampleCategoriesKeys, SampleListItemKeys } from "@src/js/type/sample"
import styles from "./index.module.css"

type Props = {
    sampleList: SampleList,
    sampleCategories: SampleCategories,
    toBeShrink: boolean,
}

type BreadcrumbProps = {
    categories: Array<string>
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ categories }) => {
    return <>
        {categories.map(category => {
            <><span>{category}</span><span> &gt </span></>
        })}
    </>
}

const SampleCategoryContainer: React.FC<SampleCategories> = ({ [SampleCategoriesKeys.Categories]: sampleCategoryItems }) => {
    return <></>
}

type SampleSelectorOptionProps = {
    item: SampleListItem,
    index: number,
    lang: Language,
    cached: boolean,
}


const SampleSelectorOption: React.FC<SampleSelectorOptionProps> = ({ index, item, lang, cached }) => {
    const cachedSymbol = cached ? "✔" : ""
    return (
        <div className={styles.optionContainer}>
            <div className={styles.cachedSymbol}>{cachedSymbol}</div>
            <div className={styles.optionIndex}>{index}</div>
            <div className={styles.optionLabel}>{item[SampleListItemKeys.ListName][lang]}</div>
        </div>
    )
}

const SampleListSelector: React.FC<SampleList> = ({ [SampleListKeys.ListOfSample]: listOfSample }) => {
    const lang = "ja"
    const locallyCached = listOfSample.map((_, i) => i % 3 == 0 || i % 5 == 0)
    return <>
        {
            listOfSample.map((sampleListItem, i) => {
                return <SampleSelectorOption index={i + 1} item={sampleListItem} lang={lang} cached={locallyCached[i]} />
            })
        }
    </>
}

export const SampleListContainer: React.FC<Props> = ({ sampleList, sampleCategories, toBeShrink }) => {
    return <div className={`${styles.sampleListContainer} ${toBeShrink ? styles.inActive : ''}`}>
        <SampleCategoryContainer {...sampleCategories} />
        <SampleListSelector {...sampleList} />
    </div>
}