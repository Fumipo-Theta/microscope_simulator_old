/**
 *  Language code of sample list is such as "ja" or "en".
 */
import deleteOldVersionDatabase from "./deleteOldVersionDatabase.js"
import setToggleNicolEvents from "./setToggleNicolEvents.js"
import setRockSelectEventHandlers from "./setRockSelectEventHandlers.js"
import setCanvasEventHandlers from "./setCanvasEventHandlers.js"
import setLanguageSelectEventHandlers from "./setLanguageSelectEventHandlers.js"
import setContactFormEventHandlers from "./setContactFormEventHandlers.js"
import initState from "./initState.js"
import updateViewerGeometry from "./updateViewerGeometry.js"
import updateView from "./updateView.js"
import es6Available from "./es6Available.js"
import checkSupportedImageFormat from "./checkSupportedImageFormat.js"
import overrideLanguageByLocalStorage from "./overrideLanguageByLocalStorage.js"
import connectDatabase from "./connectDatabase.js"
import getStoredDBEntryKeys from "./getStoredDBEntryKeys.js"
import loadSampleList from "./load_sample_list.js"
import { hideLoadingMessage } from "./loading_indicator_handler.js"
import fetchPackageById from "./fetch_package_by_query.js"
import showSampleList from "./showSampleList.js"
import { showErrorMessage } from "./error_indicator_handler.js"

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

function isMobileEnv(userAgent) {
    return (userAgent.indexOf("iPhone") >= 0 || userAgent.indexOf("iPad") >= 0 || userAgent.indexOf("Android") >= 0)
}

function notifyIncompatibleEnv() {
    var warnningCard = document.getElementById("please_use_modern_browser")
    warnningCard.classList.remove("inactive")
}

const get_package_id = () => {
    const hash = location.hash.slice(1)
    return hash === "" ? undefined : hash
}

/**
    *
    * Entry point function !
    */
function init(state) {
    // Check ES6 availability
    // Set window event listener
    //
    if (!es6Available) {
        notifyIncompatibleEnv()
        return
    }

    // スマートフォンの場合はorientationchangeイベントを監視する
    if (isMobileEnv(navigator.userAgent))
        window.addEventListener(
            "orientationchange",
            e => updateViewerGeometry(state).then(updateView),
            false
        );


    window.addEventListener(
        "resize",
        e => updateViewerGeometry(state).then(updateView),
        false
    );

    function tee(value) {
        return (f) => {
            f(value)
            return value
        }
    }


    updateViewerGeometry(state)
        .then(checkSupportedImageFormat)
        .then(overrideLanguageByLocalStorage)
        .then(connectDatabase)
        .then(getStoredDBEntryKeys)
        .then(state => tee(state)(async _ => {
            const response = await loadSampleList()
            showSampleList(response["list_of_sample"], state.language, state.storedKeys)
        }))
        .then(state => {
            const packageID = get_package_id()
            if (packageID) {
                console.log(packageID)
                return fetchPackageById(state, packageID)
            } else {
                return state
            }
        })
        .then(hideLoadingMessage)
        .catch(e => {
            console.error(e)
            showErrorMessage("<p>Internet disconnected.</p>")()
            hideLoadingMessage(e);
        })


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
