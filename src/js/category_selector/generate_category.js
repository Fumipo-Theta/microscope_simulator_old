import { staticSettings } from "../config/config.js"

class CategoryState {
    constructor(name, activated) {
        this.name = name
        this.activated = activated
    }

    getName() {
        return this.name
    }

    isActivated() {
        return this.activated
    }
}

/**
 * 
 * @param {HtmlElement} wrapper
 * @param {"ja" | "en"} lang
 */
export default async function generateCategorySelector(wrapper, state) {
    const category = await fetch(staticSettings.getSampleCategoryURL())
        .then(response => response.json())
    const activeCategories = category.categories.map(cat => {
        const [child, categories] = makeCategoryImpl(cat, state.uiState.language)
        if (child) {
            wrapper.appendChild(child)
        }
        return categories
    }).flat()
    state.uiState.sampleFilter.reset(
        activeCategories.filter(catState => catState.isActivated())
            .map(catState => catState.getName())
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
function makeCategoryImpl(category, lang, level = 0, parentCategory = undefined) {
    const thisCategory = concatCategory(parentCategory, category.id)
    const checkboxId = `category-group__${thisCategory}`
    const checkboxElem = document.querySelector(`#${checkboxId}`)
    const catState = new CategoryState(category.id, checkboxElem === null ? false : checkboxElem.checked)
    // Because category is static, update label if the category selector exists.
    if (catState.activated) {
        const label = document.querySelector(`#${checkboxId}+label`)
        label.innerText = category.label[lang]
        let subcategories = category.subcategories.map(subcat => {
            const [_nextInner, cat] = makeCategoryImpl(subcat, lang, level + 1, thisCategory)
            return cat
        })
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
    <input type="checkbox" class="${labelClass}" value="${thisCategory}"
        id="${checkboxId}">
    <label for="${checkboxId}" class="${labelClass}">${category.label[lang]}</label>
    `
    outer.innerHTML = checkbox

    if (category.subcategories.length > 0) {
        let subcategories = category.subcategories.map(subcat => {
            const [nextInner, cat] = makeCategoryImpl(subcat, lang, level + 1, thisCategory)
            inner.appendChild(nextInner)
            return cat
        }).flat()
        outer.appendChild(inner)
        return [outer, [...subcategories, catState]]
    }
    return [outer, [catState]]
}

function concatCategory(parent, child) {
    if (parent === undefined) return child
    return parent + "__" + child
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