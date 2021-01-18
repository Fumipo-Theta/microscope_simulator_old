
import updateSampleList from "../usecase/update_sample_list.js"
import { enumCategoryLevels } from "./generate_category.js"

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
    [...modal.querySelectorAll("input.super_category")].forEach(scat => {
        scat.addEventListener(
            "change",
            e => {
                const self = e.target
                const allParent = enumCategoryLevels(self.value)
                    .slice(0, -1)
                    .map(level => document.querySelector(`#category-group__${level}`))
                const allParticipants = [
                    ...allParent,
                    ...self.parentNode.querySelectorAll("input.super_category"),
                    ...self.parentNode.querySelectorAll("input.category")
                ]

                toggleAll(
                    allParticipants,
                    self.checked,
                    elem => {
                        state.uiState.sampleFilter.addCategory(elem.value)
                    },
                    elem => {
                        state.uiState.sampleFilter.removeCategory(elem.value)
                    }
                )
                console.log(state.uiState.sampleFilter.listCategory())

                const uiState = state.uiState
                updateSampleList(uiState.language, uiState.storedKeys, uiState.sampleFilter)
            }
        )
    });

    [...modal.querySelectorAll("input.category")].forEach(cat => {
        cat.addEventListener(
            "change",
            e => {
                const self = e.target
                const allParent = enumCategoryLevels(self.value)
                    .slice(0, -1)
                    .map(level => document.querySelector(`#category-group__${level}`))

                toggleAll(
                    allParent,
                    self.checked,
                    elem => {
                        state.uiState.sampleFilter.addCategory(elem.value)
                    },
                    elem => {
                        state.uiState.sampleFilter.removeCategory(elem.value)
                    }
                )
                console.log(state.uiState.sampleFilter.listCategory())

                const uiState = state.uiState
                updateSampleList(uiState.language, uiState.storedKeys, uiState.sampleFilter)
            }
        )
    })

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

function toggleAll(inputs, toBeChecked, onChecked, onUnChecked) {
    inputs.forEach(elem => {
        elem.checked = toBeChecked
        if (toBeChecked) {
            onChecked(elem)
        } else {
            onUnChecked(elem)
        }
    })
}

function show(elem) {
    elem.classList.remove("inactive")
}

function hide(elem) {
    elem.classList.add("inactive")
}
