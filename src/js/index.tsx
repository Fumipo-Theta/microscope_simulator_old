import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Footer } from '@src/js/component/footer/footer'
/**
 *  Language code of sample list is such as "ja" or "en".
 */
import { RootState } from '@src/js/type/entity'
import deleteOldVersionDatabase from "./deleteOldVersionDatabase"
import setToggleNicolEvents from "./setToggleNicolEvents"
import setRockSelectEventHandlers from "./setRockSelectEventHandlers"
import setCanvasEventHandlers from "./setCanvasEventHandlers"
import setLanguageSelectEventHandlers from "./setLanguageSelectEventHandlers"
import initState from "./state/initState"
import updateViewerGeometry from "./updateViewerGeometry"
import updateView from "./updateView"
import es6Available from "./es6Available"
import checkSupportedImageFormat from "./checkSupportedImageFormat"
import connectCacheDatabase from "./connectCacheDatabase"
import getStoredDBEntryKeys from "./getStoredDBEntryKeys"
import { hideLoadingMessage } from "./loading_indicator_handler"
import fetchPackageById from "./fetch_package_by_query"
import { showErrorMessage } from "./error_indicator_handler"
import updateSampleList from "./usecase/update_sample_list"
import setCategorySelectorEventHandlers from "./category_selector/ui_event_handler"
import generateCategorySelector from "./category_selector/generate_category"

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
function init(state: RootState) {
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

    function tee(f) {
        return (value) => {
            f(value)
            return value
        }
    }

    /* Set event listener for category selector */
    generateCategorySelector(
        document.querySelector("#wrapper-category_selector"),
        state
    ).then(_ => {
        setCategorySelectorEventHandlers(
            document.querySelector("#modal-category_selector"),
            document.querySelector("#toggle_category"),
            document.querySelector("#button-close-category_selector"),
            state
        )
    })

    updateViewerGeometry(state)
        .then(checkSupportedImageFormat)
        .then(connectCacheDatabase)
        .then(getStoredDBEntryKeys)
        .then(tee(_ => {
            const uiState = state.uiState
            updateSampleList(uiState.language, uiState.storedKeys, uiState.sampleFilter)
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

    ReactDOM.render(
        <Footer />,
        document.getElementById("footer")
    )
    return e => { }
}

window.addEventListener(
    "DOMcontentloaded",
    init(initState()),
    false
)
