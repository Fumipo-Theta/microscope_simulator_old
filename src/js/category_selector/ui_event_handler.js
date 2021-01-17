/**
 * This function must be called after element in the
 *   modal window are registered.
 *
 * @param {HTMLElement} modal
 * @param {HTMLElement} toggle_modal_button
 * @param {HTMLElement} close_modal_button
 */
export default function setEventHandlers(
    modal,
    toggle_modal_button,
    close_modal_button
) {
    toggle_modal_button.addEventListener(
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

    close_modal_button.addEventListener(
        "click",
        e => {
            hide(modal)
            toggle_modal_button.checked = false
        },
        false
    )
}

function show(elem) {
    elem.classList.remove("inactive")
}

function hide(elem) {
    elem.classList.add("inactive")
}