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
    closeModalButton
) {
    [...modal.querySelectorAll("input.super_category")].forEach(scat => {
        scat.addEventListener(
            "change",
            e => {
                const self = e.target
                toggleAll(self.parentNode.querySelectorAll("input.super_category"), self.checked)
                toggleAll(self.parentNode.querySelectorAll("input.category"), self.checked)
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

function toggleAll(inputs, toBeChecked) {
    [...inputs].forEach(elem => {
        elem.checked = toBeChecked
    })
}

function show(elem) {
    elem.classList.remove("inactive")
}

function hide(elem) {
    elem.classList.add("inactive")
}
