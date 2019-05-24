import updateView from "./updateView.js"

export default function setToggleNicolEvents(state) {

    const toggleNicolButton = document.querySelector("#change_nicol")
    const toggleNicolLabel = document.querySelector("#change_nicol + label")

    const toggleNicolHandler = state => new Promise((res, rej) => {

        toggleNicolButton.checked = state.isCrossNicol
        state.isCrossNicol = !state.isCrossNicol;


        res(state)
    })

    toggleNicolButton.addEventListener(
        "click",
        e => { e.preventDefault() },
        false
    )


    toggleNicolLabel.addEventListener(
        "touch",
        e => { e.preventDefault() },
        false
    )

    toggleNicolButton.addEventListener(
        "touch",
        e => { e.preventDefault() },
        false
    )


    toggleNicolLabel.addEventListener(
        "mouseup",
        e => toggleNicolHandler(state)
            .then(updateView),
        false
    )

    toggleNicolLabel.addEventListener(
        "touchend",
        e => toggleNicolHandler(state)
            .then(updateView)
            .then(_ => {
                if (e.cancelable) {
                    e.preventDefault();
                }
            }),
        false
    )
}
