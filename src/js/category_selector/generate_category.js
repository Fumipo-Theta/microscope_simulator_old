import { staticSettings } from "../config/config.js"


/**
 * 
 * @param {HtmlElement} wrapper
 * @param {"ja" | "en"} lang
 */
export default async function generateCategorySelector(wrapper, lang) {
    const category = await fetch(staticSettings.getSampleCategoryURL())
        .then(response => response.json())
    category.categories.forEach(cat => {
        wrapper.appendChild(makeCategoryImpl(cat, lang))
    })
    return category
}

/**
 * SampleCategory = {
 *  group: String,
 *  label: {
 *    ja: String,
 *    en: String
 *  },
 *  subcategories: Array<Category>
 * }
 * @param {SampleCategory} category
 */
function makeCategoryImpl(category, lang, level = 0) {
    const [outer, inner] = level >= 2
        ? makeBottomLevel()
        : makeTopLevel()
    const checkboxId = `category-group-${category.group}`
    const labelClass = category.subcategories.length > 0
        ? "super_category"
        : "category"
    const checkbox = `<div>
    <input checked type="checkbox" value="${category.group}"
        id="${checkboxId}">
    <label for="${checkboxId}" class="${labelClass}">${category.label[lang]}</label>
    </div>
    `
    outer.innerHTML = checkbox

    if (category.subcategories.length > 0) {
        category.subcategories.forEach(subcat => {
            inner.appendChild(makeCategoryImpl(subcat, lang, level + 1))
        })
        outer.appendChild(inner)
    }
    return outer
}

function makeTopLevel() {
    // level == 0
    const thisCategory = document.createElement("div")
    thisCategory.classList.add("category_group")
    thisCategory.classList.add("stretched")
    const innerCategory = document.createElement("div")
    innerCategory.classList.add("sub_category")
    return [thisCategory, innerCategory]
}

function makeBottomLevel() {
    // level >= 2
    const thisCategory = document.createElement("div")
    thisCategory.classList.add("sub_category_group")
    const innerCategory = document.createElement("div")
    innerCategory.classList.add("column-direction")
    innerCategory.classList.add("sub_category")
    return [thisCategory, innerCategory]
}