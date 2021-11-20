import React, { useState, useCallback, MouseEventHandler } from "react"
import { useSetRecoilState } from "recoil"
import { I18nMap, Language } from "@src/js/type/entity"
import { currentCategoryState } from "@src/js/state/atom/sample_category_state"
import { SampleCategoriesKeys, SampleCategoryItem, SampleCategoryItemKeys, ROOT_CATEGORY_ID } from "@src/js/type/sample"
import styles from "./index.module.css"
import { ISampleListMessage } from "@src/js/type/message"
import useLang from "@src/js/hooks/use_lang"
import { withFallbackLanguage } from "@src/js/util/language_util"

const MAX_DEPTH = 3

type BreadcrumbProps = {
    categorySetter: (node: CategoryNode) => MouseEventHandler,
    path: Array<string>,
    lang: Language,
    nodeMap: { string: CategoryNode },
    message: ISampleListMessage,
}


const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, lang, nodeMap, categorySetter, message }) => {
    // Show only some parents because of limitation of space
    const depth = path.length
    const shownPath = depth > MAX_DEPTH ? [ROOT_CATEGORY_ID, ...path.slice(depth - MAX_DEPTH, depth)] : path
    return <div className={styles.breadcrumb}>
        <div className={styles.rowTitle}>{withFallbackLanguage(message.shownCategory, lang)}</div>
        {shownPath.length == 0 ? <div></div> : shownPath.map(
            (directory, i, all) => {
                const node = nodeMap[directory]
                const label = node.getCategory().label[lang]
                const isCurrent = all.length - 1 == i
                const onClick = isCurrent ? (_) => { } : categorySetter(node)
                return (<div key={directory} className={styles.breadFragment}>
                    <div onClick={onClick} className={`${styles.breadLabel} ${isCurrent ? styles.current : ""}`}>{label}</div>
                    {isCurrent ? <></> : <div>{">"}</div>}
                </div>)
            }
        )}
    </div>
}

type CategoryButtonProps = {
    label: string,
    onClick: MouseEventHandler
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ label, onClick }) => {
    return <button className={styles.categoryButton} onClick={onClick}>{label}</button>
}

type CategorySelectorProps = {
    categorySetter: (node: CategoryNode) => MouseEventHandler,
    lang: Language,
    node: CategoryNode,
    nodeMap: { string: CategoryNode },
    isActive: boolean,
    message: ISampleListMessage,
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categorySetter, lang, node, nodeMap, isActive, message }) => {
    console.log(node)
    return (
        <div className={`${styles.categorySelector} ${isActive ? "" : styles.categorySelectorClosed}`}>
            {
                node.getChildren().length > 0
                    ? <><div className={styles.rowTitle}>{withFallbackLanguage(message.promptSelectingSubCategory, lang)}</div>
                        {node.getChildren().map(child => {
                            const category = nodeMap[child].getCategory()
                            return <CategoryButton key={child} label={category.label[lang]} onClick={categorySetter(nodeMap[child])} />
                        })}
                    </>
                    : <div className={styles.info}>No subcategory</div>
            }
        </div>
    )
}

type Props = {
    [SampleCategoriesKeys.Categories]: Array<SampleCategoryItem>,
    message: ISampleListMessage
}

export const SampleCategoryContainer: React.FC<Props> = ({ message, [SampleCategoriesKeys.Categories]: sampleCategoryItems }) => {
    const [currentPath, setPath] = useState<string[]>([ROOT_CATEGORY_ID])
    const setCurrentCategoryValue = useSetRecoilState(currentCategoryState)
    const categorySetter = useCallback((node: CategoryNode) => (_) => {
        setPath(node.getPath())
        setCurrentCategoryValue(node.getCategory()[SampleCategoryItemKeys.Id])
    }, [setPath, setCurrentCategoryValue])
    const [lang, _] = useLang()
    // const [isActive, updateActive] = useState(false)
    const isActive = true
    // const toggleCategorySelector = useCallback((_) => { updateActive(current => !current) }, [updateActive])
    const categoryMap = CategoryNode.constructNodes(sampleCategoryItems)
    const currentCategory = currentPath[currentPath.length - 1]

    return <div className={styles.categoryContainer}>
        <div className={styles.categoryContainerMenuBar}>
            <Breadcrumb path={currentPath} lang={lang} nodeMap={categoryMap} categorySetter={categorySetter} message={message} />
        </div>
        <CategorySelector isActive={isActive} categorySetter={categorySetter} lang={lang} node={categoryMap[currentCategory]} nodeMap={categoryMap} message={message} />
    </div>
}

export class CategoryNode {
    private path: string[]
    private children: string[] = []
    private category: SampleCategoryItem

    constructor(category: SampleCategoryItem, path: string[]) {
        this.category = category
        this.path = [...path, category.id]
    }

    appendChild(childName: string) {
        this.children.push(childName)
    }

    getPath(): string[] {
        return this.path
    }


    getChildren(): string[] {
        return this.children
    }

    getCategory(): SampleCategoryItem {
        return this.category
    }

    static constructNodes(rawRootNodes: SampleCategoryItem[]): { string: CategoryNode } {
        const label = { en: "All", ja: "全て" } as I18nMap<string>
        const root: SampleCategoryItem = {
            id: ROOT_CATEGORY_ID,
            label: label,
            subcategories: rawRootNodes
        }

        return Object.fromEntries(gatherChildren(root, [], (rawNode, path) => {
            const node = new CategoryNode(rawNode, path)
            const subCat = rawNode?.[SampleCategoryItemKeys.SubCategories] || []
            subCat.forEach(sub => {
                node.appendChild(sub[SampleCategoryItemKeys.Id])
            })
            return node
        }))
    }
}

function gatherChildren(node: SampleCategoryItem, path: string[], callback): Array<(string | SampleCategoryItem)[]> {
    const base = [node[SampleCategoryItemKeys.Id], callback(node, path)]
    if (!node[SampleCategoryItemKeys.SubCategories]) return [base]
    const currentPath = [...path, node[SampleCategoryItemKeys.Id]]

    return node[SampleCategoryItemKeys.SubCategories].length > 0
        ? [[base], node[SampleCategoryItemKeys.SubCategories].flatMap(sub => gatherChildren(sub, currentPath, callback))].flat()
        : [base]
}
