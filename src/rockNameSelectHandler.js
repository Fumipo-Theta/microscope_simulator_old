import { hideErrorMessage } from "./error_indicator_handler.js"
import { showLoadingMessage } from "./loading_indicator_handler.js"
import { hideWelcomeBoard, showViewer, showNicolButton } from "./viewer_handlers.js"
import queryImagePackage from "./queryImagePackage.js"
import updateStateByMeta from "./updateStateByMeta.js"
import updateViewDiscription from "./updateViewDiscription.js"
import updateImageSrc from "./updateImageSrc.js"
import register from "./register.js"
import markDownloadedOption from "./markDownloadedOption.js"
import updateView from "./updateView.js"

/**
 * fetch lastmodified
 * fetch manifest
 * fetch sumbnail
 *
 * show sumbnail
 * show discription
 *
 * load images
 *  from db
 *  fetch
 *
 * store data
 */
export default function rockNameSelectHandler(state) {
    return new Promise(async (res, rej) => {
        const rock_selector = document.querySelector("#rock_selector")
        const packageName = rock_selector.options[rock_selector.selectedIndex].value
        location.hash = packageName

        state.canRotate = false;
        hideErrorMessage()
        showLoadingMessage()
        hideWelcomeBoard()
        showViewer()
        showNicolButton()

        try {
            const [response, isNewData] = await queryImagePackage(state, packageName);
            const manifest = JSON.parse(response.manifest);

            const new_state = await updateStateByMeta(state)(packageName, manifest)
                .then(updateViewDiscription)
                .then(updateImageSrc(response.thumbnail, "jpg"))
                .then(updateView)

            new_state.canRotate = true

            updateImageSrc(response.zip, response.image_format)(new_state)
                .then(state => register(state, isNewData)(response))
                .then(markDownloadedOption(packageName)(manifest))
                .then(updateView)
                .then(res)
        } catch (e) {
            rej(e)
        }
    })
}
