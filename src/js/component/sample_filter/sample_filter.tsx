import React, { useState, useCallback, MouseEventHandler } from "react"
import { useRecoilValue } from "recoil"
import { I18nMap, Language } from "@src/js/type/entity"
import { systemLanguageState } from "@src/js/state/atom/system_language_state"
import { SampleCategories, SampleCategoriesKeys, SampleCategoryItem, SampleCategoryItemKeys } from "@src/js/type/sample"
import styles from "./index.module.css"

type BreadcrumbProps = {
    setPath: React.Dispatch<React.SetStateAction<string[]>>,
    path: Array<string>,
    lang: Language,
    nodeMap: { string: CategoryNode },
}

const MAX_DEPTH = 3

const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, lang, nodeMap, setPath }) => {
    // Show only some parents because of limitation of space
    const depth = path.length
    const shownPath = depth > MAX_DEPTH ? path.slice(depth - MAX_DEPTH, depth) : path
    return <div className={styles.breadcrumb}>
        {shownPath.length == 0 ? <></> : shownPath.map(
            (directory) => {
                const node = nodeMap[directory]
                const label = node.getCategory().label[lang]
                return (<div key={directory}><span>{">"}</span><span onClick={() => { setPath(node.getPath()) }}>{label}</span></div>)
            }
        )}
    </div>
}

type CategorySelectorTogglerProps = {
    isActive: boolean,
    onClick: MouseEventHandler,
}

const CategorySelectorToggler: React.FC<CategorySelectorTogglerProps> = ({ onClick, isActive }) => {
    return (
        <button
            className={`${styles.toggleFilterButton} ${isActive ? styles.active : ""}`}
            onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#eeeeff" color="#000000"><path d="M0 0h24v24H0z" fill="none"></path><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"></path></svg>
        </button>

    )
}

type CategoryButtonProps = {
    label: string,
    onClick: MouseEventHandler
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ label, onClick }) => {
    return <button onClick={onClick}>{label}</button>
}

type CategorySelectorProps = {
    setPath: React.Dispatch<React.SetStateAction<string[]>>,
    lang: Language,
    node: CategoryNode,
    nodeMap: { string: CategoryNode },
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ setPath, lang, node, nodeMap }) => {
    const categorySetter = useCallback((current: CategoryNode) => {
        return () => {
            setPath(current.getPath())
        }
    }, [setPath])
    console.log(node)
    return (
        <>
            {node.getChildren().map(child => {
                const category = nodeMap[child].getCategory()
                return <CategoryButton key={child} label={category.label[lang]} onClick={categorySetter(nodeMap[child])} />
            }
            )}
        </>
    )
}

export const SampleCategoryContainer: React.FC<SampleCategories> = ({ [SampleCategoriesKeys.Categories]: sampleCategoryItems }) => {
    const [currentPath, setPath] = useState<string[]>(["root"])
    const language = useRecoilValue(systemLanguageState)
    const [isActive, updateActive] = useState(false)
    const toggleCategorySelector = useCallback((_) => { updateActive(current => !current) }, [updateActive])
    const categoryMap = CategoryNode.constructNodes(sampleCategoryItems)
    const currentCategory = currentPath[currentPath.length - 1]
    return <div className={styles.categoryContainer}>
        <div className={styles.categoryContainerMenuBar}>
            <Breadcrumb path={currentPath} lang={language} nodeMap={categoryMap} setPath={setPath} />
            <CategorySelectorToggler onClick={toggleCategorySelector} isActive={isActive} />
        </div>
        {
            isActive
                ? <CategorySelector setPath={setPath} lang={language} node={categoryMap[currentCategory]} nodeMap={categoryMap} />
                : <></>
        }
    </div>
}

class CategoryNode {
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
        const label = { en: "Top", ja: "Top" } as I18nMap<string>
        const root: SampleCategoryItem = {
            id: "root",
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
