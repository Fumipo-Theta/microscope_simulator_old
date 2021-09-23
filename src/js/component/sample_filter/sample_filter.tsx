import React, { useState, useCallback, MouseEventHandler, TouchEventHandler } from "react"
import { SampleCategories, SampleCategoriesKeys } from "@src/js/type/sample"
import styles from "./index.module.css"

type BreadcrumbProps = {
    path: Array<string>
}

const MAX_DEPTH = 3

const Breadcrumb: React.FC<BreadcrumbProps> = ({ path }) => {
    const depth = path.length
    const shownPath = depth > MAX_DEPTH ? path.slice(MAX_DEPTH - 3, depth) : path
    return <div className={styles.breadcrumb}>
        {path.length == 0 ? <></> : path.map((directory) => (<div key={directory}><span>{">"}</span><span>{directory}</span></div>))}
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

type CategorySelectorProps = {
    currentPath: string[],
    setPath: React.Dispatch<React.SetStateAction<string[]>>,
    categoryTree: SampleCategories,
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ currentPath, setPath, categoryTree }) => {
    const
    return (
        <></>
    )
}

export const SampleCategoryContainer: React.FC<SampleCategories> = ({ [SampleCategoriesKeys.Categories]: sampleCategoryItems }) => {
    const [currentPath, setPath] = useState<string[]>([])
    const [isActive, updateActive] = useState(false)
    const toggleCategorySelector = useCallback((_) => { updateActive(current => !current) }, [updateActive])
    return <div className={styles.categoryContainer}>
        <div className={styles.categoryContainerMenuBar}>
            <Breadcrumb path={currentPath} />
            <CategorySelectorToggler onClick={toggleCategorySelector} isActive={isActive} />
        </div>
        {
            isActive
                ? <div>Active</div>
                : <></>
        }
    </div>
}

class CategoryNode {
    private name: string
    private parent: CategoryNode | null
    private children: CategoryNode[] = []

    constructor(name: string, parent: CategoryNode | null = null) {
        this.name = name
        this.parent = parent
    }

    appendChildren(childrenNames: string[]) {
        this.children = childrenNames.map(name => new CategoryNode(name, this))
    }

    getParent(): CategoryNode | null {
        return this.parent
    }

    getChildren(): CategoryNode[] {
        return this.children
    }
}