(function (state) {
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

    const rock_selector = document.querySelector("#rock_selector")

    rock_selector.addEventListener(
        "change",
        e => {
            rockNameSelectHandler(state)
                .then(updateView)
                .then(hideErrorCard())
                .then(hideLoadingAnimation)
                .catch(e => {
                    console.log("Sample cannot be loaded because of network error.")
                    showErrorCard("<p>Internet disconnected.</p>")(e)
                    hideLoadingAnimation()
                })
        },
        false
    )


    viewer.addEventListener(
        "mousedown",
        touchStartHandler(state),
        false
    )

    viewer.addEventListener(
        "dragstart",
        e => { e.preventDefault() },
        false
    )

    viewer.addEventListener(
        "drag",
        e => { e.preventDefault() },
        false
    )

    viewer.addEventListener(
        "dragend",
        e => { e.preventDefault() },
        false
    )



    viewer.addEventListener(
        "touchstart",
        touchStartHandler(state),
        false
    )

    viewer.addEventListener(
        "mousemove",
        touchMoveHandler(state),
        false
    )

    viewer.addEventListener(
        "touchmove",
        touchMoveHandler(state),
        false
    )

    viewer.addEventListener(
        "mouseup",
        touchEndHandler(state),
        false
    )

    viewer.addEventListener(
        "touchend",
        touchEndHandler(state),
        false
    )

    viewer.addEventListener(
        "wheel",
        wheelHandler(state),
        false
    )

    const languageSelector = document.querySelector("#language_selector")

    languageSelector.addEventListener("change",
        e => languageChangeHundler(state)(e)
            .then(sampleListLoader)
            .then(updateViewDiscription),
        false
    )

    document.querySelector("#form-contact div.button").addEventListener(
        "click",
        contact_handler(),
        false
    )


    /**
     *
     * Entry point function !
     */
    function init(state) {
        const userAgent = navigator.userAgent;

        // スマートフォンの場合はorientationchangeイベントを監視する
        if (userAgent.indexOf("iPhone") >= 0 || userAgent.indexOf("iPad") >= 0 || userAgent.indexOf("Android") >= 0)
            window.addEventListener(
                "orientationchange",
                e => windowResizeHandler(state).then(updateView),
                false
            );
        else
            window.addEventListener(
                "resize",
                e => windowResizeHandler(state).then(updateView),
                false
            );

        if (!es6Available()) {
            var warnningCard = document.getElementById("please_use_modern_browser")
            warnningCard.classList.remove("inactive")

        } else {
            windowResizeHandler(state)
                .then(connectLocalStorage)
                .then(overwrideLanguageByLocalStorage)
                .then(connectDatabase)
                .then(sampleListLoader)
                .then(hideLoadingAnimation)
                .catch(e => {
                    console.error(e)
                    hideLoadingAnimation(e);
                })
        }
    }

    window.addEventListener(
        "DOMcontentloaded",
        init(state),
        false
    )
})(resetState())
