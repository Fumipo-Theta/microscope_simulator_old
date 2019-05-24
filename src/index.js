/**
 *  Language code of sample list is such as "ja" or "en".
 */
import deleteOldVersionDatabase from "./deleteOldVersionDatabase.js"
import { postSkipWaiting, register_sw } from "./init_sw.js";
import setToggleNicolEvents from "./setToggleNicolEvents.js"
import setRockSelectEventHandlers from "./setRockSelectEventHandlers.js"
import setCanvasEventHandlers from "./setCanvasEventHandlers.js"
import setLanguageSelectEventHandlers from "./setLanguageSelectEventHandlers.js"
import setContactFormEventHandlers from "./setContactFormEventHandlers.js"
import initState from "./initState.js"
import windowResizeHandler from "./windowResizeHandler.js"
import updateView from "./updateView.js"
import es6Available from "./es6Available.js"
import connectLocalStorage from "./connectLocalStorage.js"
import checkSupportedImageFormat from "./checkSupportedImageFormat.js"
import overrideLanguageByLocalStorage from "./overrideLanguageByLocalStorage.js"
import connectDatabase from "./connectDatabase.js"
import sampleListLoader from "./sampleListLoader.js"
import { hideLoadingMessage } from "./loading_indicator_handler.js"


deleteOldVersionDatabase()




function handleErrors(response) {
    if (response.ok) {
        return response;
    }

    switch (response.status) {
        case 400: throw new Error('INVALID_TOKEN');
        case 401: throw new Error('UNAUTHORIZED');
        case 500: throw new Error('INTERNAL_SERVER_ERROR');
        case 502: throw new Error('BAD_GATEWAY');
        case 404: throw new Error('NOT_FOUND');
        default: throw new Error('UNHANDLED_ERROR');
    }
}

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
            .then(checkSupportedImageFormat)
            .then(overrideLanguageByLocalStorage)
            .then(connectDatabase)
            .then(sampleListLoader)
            .then(hideLoadingMessage)
            .catch(e => {
                console.error(e)
                hideLoadingMessage(e);
            })
    }

    document.querySelector("#reload").addEventListener(
        "click",
        postSkipWaiting
    )

    window.addEventListener("load", register_sw)
    setToggleNicolEvents(state)
    setRockSelectEventHandlers(state)
    setCanvasEventHandlers(state)
    setLanguageSelectEventHandlers(state)
    setContactFormEventHandlers(state)
}

window.addEventListener(
    "DOMcontentloaded",
    init(initState()),
    false
)
