import React, { useState } from "react"
import { SampleCategories, SampleCategoriesKeys } from "@src/js/type/sample"
import styles from "./index.module.css"

type BreadcrumbProps = {
    path: Array<string>
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ path }) => {
    return <div className={styles.breadcrumb}>
        {path.map((directory) => (<div key={directory}><span>{">"}</span><span>{directory}</span></div>))}
    </div>
}
export const SampleCategoryContainer: React.FC<SampleCategories> = ({ [SampleCategoriesKeys.Categories]: sampleCategoryItems }) => {
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
