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

export default function fetchPackageById(state, packageID) {
    return new Promise(async (res, rej) => {

        state.canRotate = false;
        hideErrorMessage()
        showLoadingMessage()
        hideWelcomeBoard()
        showViewer()
        showNicolButton()

        try {
            const [response, isNewData, zipLoader] = await getPackageMetaData(state, packageID);
            const manifest = JSON.parse(response.manifest);

            const [new_state, new_response] = await updateStateByMeta(state)(packageID, manifest)
                .then(updateViewDiscription)
                .then(updateImageSrc(response.thumbnail, "jpg"))
                .then(updateView)
                .then(fetchImagePackage(zipLoader, response, isNewData))

            new_state.canRotate = true

            updateImageSrc(new_response.zip, new_state.supportedImageType)(new_state)
                .then(state => register(state, isNewData)(new_response))
                .then(markDownloadedOption(packageID)(manifest))
                .then(updateView)
                .then(res)
        } catch (e) {
            rej(e)
        }
    })
}