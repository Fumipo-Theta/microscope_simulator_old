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

export default function fetchPackageById(state, packageID) {
    return new Promise(async (res, rej) => {

        state.canRotate = false;
        hideErrorMessage()
        showLoadingMessage()
        hideWelcomeBoard()
        showViewer()
        showNicolButton()

        try {
            const [response, isNewData] = await queryImagePackage(state, packageID);
            const manifest = JSON.parse(response.manifest);

            const new_state = await updateStateByMeta(state)(packageID, manifest)
                .then(updateViewDiscription)
                .then(updateImageSrc(response.thumbnail, "jpg"))
                .then(updateView)

            new_state.canRotate = true

            updateImageSrc(response.zip, response.image_format)(new_state)
                .then(state => register(state, isNewData)(response))
                .then(markDownloadedOption(packageID)(manifest))
                .then(updateView)
                .then(res)
        } catch (e) {
            rej(e)
        }
    })
}