import { hideErrorMessage } from "./error_indicator_handler.js"
import { showLoadingMessage } from "./loading_indicator_handler.js"
import { hideWelcomeBoard, showViewer, showNicolButton } from "./viewer_handlers.js"
import getPackageMetaData from "./getPackageMetaData.js"
import updateStateByMeta from "./updateStateByMeta.js"
import updateViewDiscription from "./updateViewDiscription.js"
import updateImageSrc from "./updateImageSrc.js"
import fetchImagePackage from "./fetchImagePackage.js"
import register from "./register.js"
import markDownloadedOption from "./markDownloadedOption.js"
import updateView from "./updateView.js"

export default function rockNameSelectHandler(state) {
    return new Promise(async (res, rej) => {
        const rock_selector = document.querySelector("#rock_selector")
        const packageName = rock_selector.options[rock_selector.selectedIndex].value

        state.canRotate = false;
        hideErrorMessage()
        showLoadingMessage()
        hideWelcomeBoard()
        showViewer()
        showNicolButton()

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

        try {
            const [response, isNewData, zipLoader] = await getPackageMetaData(state, packageName);
            const manifest = JSON.parse(response.manifest);

            const [new_state, new_response] = await updateStateByMeta(state)(packageName, manifest)
                .then(updateViewDiscription)
                .then(updateImageSrc(response.thumbnail, "jpg"))
                .then(updateView)
                .then(fetchImagePackage(zipLoader, response, isNewData))

            new_state.canRotate = true

            updateImageSrc(new_response.zip, new_state.supportedImageType)(new_state)
                .then(state => register(state, isNewData)(new_response)
                )
                .then(markDownloadedOption(packageName)(manifest))
                .then(updateView)
                .then(res)
        } catch (e) {
            rej(e)
        }
    })
}
