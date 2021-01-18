import { staticSettings } from "../config/config.js"


/**
 * 
 * @param {HtmlElement} wrapper
 * @param {"ja" | "en"} lang
 */
export default async function generateCategorySelector(wrapper, state) {
    const category = await fetch(staticSettings.getSampleCategoryURL())
        .then(response => response.json())
    const categories = category.categories.map(cat => {
        const [child, categories] = makeCategoryImpl(cat, state.uiState.language)
        if (child) {
            wrapper.appendChild(child)
        }
        return categories
    }).flat()
    state.uiState.sampleFilter.addManyCategories(categories)
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
    // Because category is static, update label if the category selector exists.
    if (document.querySelector(`#${checkboxId}`)) {
        const label = document.querySelector(`#${checkboxId}+label`)
        label.innerText = category.label[lang]
        let subcategories = category.subcategories.map(subcat => {
            const [_nextInner, cat] = makeCategoryImpl(subcat, lang, level + 1, thisCategory)
            return cat
        }).flat()
        return [null, [...subcategories, category.id]]
    }

    const [outer, inner] = level >= 3
        ? makeBottomLevel()
        : level >= 2
            ? makeMiddleLevel()
            : makeTopLevel()
    const labelClass = category.subcategories.length > 0
        ? "super_category"
        : "category"
    const checkbox = `
    <input checked type="checkbox" class="${labelClass}" value="${thisCategory}"
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
        return [outer, [...subcategories, category.id]]
    }
    return [outer, [category.id]]
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