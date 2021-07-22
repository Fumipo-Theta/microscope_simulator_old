import { RootState } from "@src/js/type/entity"
import { staticSettings } from "@src/js/config/config"

class CategoryState {
    private path: string;
    private selected: boolean;
    constructor(path, selected) {
        this.path = path
        this.selected = selected
    }

    getPath() {
        return this.path
    }

    isSelected() {
        return this.selected
    }
}

export default async function generateCategorySelector(wrapper: HTMLElement, state: RootState) {
    const { uiState: { queryParams } } = state
    const category = await fetch(staticSettings.getSampleCategoryURL(queryParams.category))
        .then(response => response.json())
    const activeCategories = category.categories.map(cat => {
        const [child, categories] = makeCategoryImpl(cat, state.uiState.language)
        if (child) {
            wrapper.appendChild(child as HTMLElement)
        }
        return categories
    }).flat()
    state.uiState.sampleFilter.reset(
        activeCategories.filter(catState => catState.isSelected())
            .map(catState => catState.getPath())
    )
    return state
}

/**
 * SampleCategory = {
 *  id: String,
 *  label: {
 *    ja: String,
 *    en: String
 *  },
 *  subcategories: Array<Category>
 * }
 * @param {SampleCategory} category
 */
function makeCategoryImpl(category, lang, level = 0, parentCategory = []) {
    const categoryPath = appendCategory(parentCategory, category.id)
    const checkboxId = `category-group__${concatCategory(categoryPath, "__")}`
    const checkboxElem = document.querySelector(`#${checkboxId}`) as HTMLInputElement
    const catState = new CategoryState(categoryPath, checkboxElem === null ? false : checkboxElem.checked)
    // Because category is static, update label if the category selector exists.
    if (checkboxElem) {
        const label = document.querySelector(`#${checkboxId}+label`) as HTMLElement
        label.innerText = category.label[lang]
        let subcategories = category.subcategories.map(subcat => {
            const [_nextInner, cat] = makeCategoryImpl(subcat, lang, level + 1, categoryPath)
            return cat
        }).flat()
        return [null, [...subcategories, catState]]
    }

    // Create new elements
    const [outer, inner] = level >= 3
        ? makeBottomLevel()
        : level >= 2
            ? makeMiddleLevel()
            : makeTopLevel()
    const labelClass = category.subcategories.length > 0
        ? "super_category"
        : "category"
    const checkbox = `
    <input type="checkbox" class="${labelClass}-checkbox ${concatCategory(categoryPath, " ")}" value="${concatCategory(categoryPath, "__")}"
        id="${checkboxId}">
    <label for="${checkboxId}" class="${labelClass} ${concatCategory(categoryPath, " ")}">${category.label[lang]}</label>
    `
    outer.innerHTML = checkbox

    if (category.subcategories.length > 0) {
        let subcategories = category.subcategories.map(subcat => {
            const [nextInner, cat] = makeCategoryImpl(subcat, lang, level + 1, categoryPath)
            inner.appendChild(nextInner as HTMLElement)
            return cat
        }).flat()
        outer.appendChild(inner)
        return [outer, [...subcategories, catState]]
    }
    return [outer, [catState]]
}

function appendCategory(parent, child) {
    if (parent.length == 0) return [child]
    return [...parent, child]
}

function concatCategory(categoryList, sep) {
    return categoryList.reduce((acc, e) => {
        if (acc === "") return e
        return acc + sep + e
    }, "")
}

export function splitCategory(category) {
    return category.split("__")
}

export function enumCategoryLevels(categoryPath) {
    return categoryPath.split("__").reduce((acc, e) => {
        if (acc.length === 0) {
            return [e]
        } else {
            return [...acc, acc[acc.length - 1] + "__" + e]
        }
    }, []
    )
}

function makeTopLevel() {
    // level <= 1
    const thisCategory = document.createElement("div")
    thisCategory.classList.add("category_group")
    thisCategory.classList.add("stretched")
    const innerCategory = document.createElement("div")
    innerCategory.classList.add("sub_category")
    return [thisCategory, innerCategory]
}

function makeMiddleLevel() {
    // level >= 2
    // ex. rock > igneous rock > volcanic rock
    const thisCategory = document.createElement("div")
    thisCategory.classList.add("sub_category_group")
    const innerCategory = document.createElement("div")
    innerCategory.classList.add("column-direction")
    innerCategory.classList.add("sub_category")
    return [thisCategory, innerCategory]
}

function makeBottomLevel() {
    // level >= 3
    // ex. rock > igneous rock > volcanic rock > rhyolite
    const thisCategory = document.createElement("div")
    const innerCategory = document.createElement("div")
    return [thisCategory, innerCategory]
}

function flattenCategory(category) {

}