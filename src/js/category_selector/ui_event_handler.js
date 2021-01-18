
import updateSampleList from "../usecase/update_sample_list.js"
import { splitCategory } from "./generate_category.js"

/**
 * This function must be called after element in the
 *   modal window are registered.
 *
 * @param {HTMLElement} modal
 * @param {HTMLElement} categorySelector
 * @param {HTMLElement} toggle_modal_button
 * @param {HTMLElement} close_modal_button
 */
export default function setEventHandlers(
    modal,
    toggleModalButton,
    closeModalButton,
    state
) {
    [
        ...modal.querySelectorAll("input.super_category"),
        ...modal.querySelectorAll("input.category")
    ].forEach((cat, _, arr) => {
        cat.addEventListener(
            "change",
            e => {
                const self = e.target
                const allCategory = splitCategory(self.value)
                const uiState = state.uiState

                if (self.checked) {
                    uiState.sampleFilter.addManyCategories(allCategory)
                    arr.forEach(elem => {
                        const elemCategory = splitCategory(elem.value)
                        if (uiState.sampleFilter.isSubset(new Set(elemCategory))) {
                            elem.checked = true
                        } else if (isSubset(new Set(allCategory), new Set(elemCategory))) {
                            uiState.sampleFilter.addManyCategories(elemCategory)
                            elem.checked = true
                        } else {
                            elem.checked = false
                        }
                    })
                } else {
                    uiState.sampleFilter.removeCategory(allCategory.slice(-1)[0])
                    arr.forEach(elem => {
                        const elemCategory = splitCategory(elem.value)
                        if (uiState.sampleFilter.isSubset(new Set(elemCategory))) {
                            elem.checked = true
                        } else if (isSubset(new Set(allCategory), new Set(elemCategory))) {
                            uiState.sampleFilter.removeManyCategories(elemCategory.slice(-1))
                            elem.checked = false
                        } else {
                            elem.checked = false
                        }
                    })
                }

                updateSampleList(uiState.language, uiState.storedKeys, uiState.sampleFilter)
            }
        )
    });



    toggleModalButton.addEventListener(
        "change",
        e => {
            if (e.target.checked) {
                show(modal)
            } else {
                hide(modal)
            }
        },
        false
    )

    closeModalButton.addEventListener(
        "click",
        e => {
            hide(modal)
            toggleModalButton.checked = false
        },
        false
    )
}

function isSubset(set, superset) {
    if (set.size == 0) {
        return true
    }
    for (let elem of set) {
        if (!superset.has(elem)) {
            return false;
        }
    }
    return true;
}

function show(elem) {
    elem.classList.remove("inactive")
}

function hide(elem) {
    elem.classList.add("inactive")
}
