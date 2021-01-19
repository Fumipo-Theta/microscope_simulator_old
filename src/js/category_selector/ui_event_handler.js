
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
        ...modal.querySelectorAll("input.super_category-checkbox")
    ].forEach((cat, _,) => {
        cat.addEventListener(
            "change",
            e => {
                const self = e.target
                const query = [...self.classList].slice(1)
                const queryClass = concatCategory(query, ".")
                const uiState = state.uiState

                if (self.checked) {
                    uiState.sampleFilter.add(query);
                    [...document.querySelectorAll("label." + queryClass)].forEach(elem => {
                        elem.classList.add("active")
                    })
                } else {
                    uiState.sampleFilter.remove(query);
                    [...document.querySelectorAll("label." + queryClass)].forEach(elem => {
                        elem.classList.remove("active")
                    })
                }
                console.log(uiState.sampleFilter.list())
                updateSampleList(uiState.language, uiState.storedKeys, uiState.sampleFilter)
            }
        )
    });

    [
        ...modal.querySelectorAll("input.category-checkbox")
    ].forEach((cat, _,) => {
        cat.addEventListener(
            "change",
            e => {
                const self = e.target
                const query = [...self.classList].slice(1)
                const queryClass = concatCategory(query, ".")
                const uiState = state.uiState

                if (self.checked) {
                    uiState.sampleFilter.add(query);
                } else {
                    uiState.sampleFilter.remove(query);
                }
                console.log(uiState.sampleFilter.list())
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

function concatCategory(categoryList, sep) {
    return categoryList.reduce((acc, e) => {
        if (acc === "") return e
        return acc + sep + e
    }, "")
}

function show(elem) {
    elem.classList.remove("inactive")
}

function hide(elem) {
    elem.classList.add("inactive")
}
