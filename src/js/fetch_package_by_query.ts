import { hideErrorMessage } from "./error_indicator_handler"
import { showLoadingMessage } from "./loading_indicator_handler"
import { hideWelcomeBoard, showViewer, showNicolButton } from "./viewer_handlers"
import queryImagePackage from "./queryImagePackage"
import updateStateByMeta from "./updateStateByMeta"
import updateViewDescription from "./updateViewDescription"
import updateImageSrc from "./updateImageSrc"
import register from "./register"
import markDownloadedOption from "./markDownloadedOption"
import updateView from "./updateView"
import { Manifest, PackageId, RootState } from "./type/entity"

const callback = () => {
    hideErrorMessage()
    showLoadingMessage()
    hideWelcomeBoard()
    showViewer()
    showNicolButton()
}

export default function fetchPackageById(state: RootState, packageID: PackageId) {
    return new Promise(async (res, rej) => {

        state.viewerState.canRotate = false;
        callback()

        try {
            const [response, isNewData] = await queryImagePackage(state, packageID);
            const manifest = JSON.parse(response.manifest) as Manifest;

            state.uiState.samplePackage = { ...response }
            const new_state = await updateStateByMeta(state)(packageID, manifest)
                .then(updateViewDescription)
                .then(updateImageSrc(response.thumbnail, "jpg"))
                .then(updateView)

            new_state.viewerState.canRotate = true

            if (isNewData) {
                response.zip = await response.zip()
            }

            updateImageSrc(response.zip, response.image_format)(new_state)
                .then(state => register(state as RootState, isNewData)(response))
                .then(markDownloadedOption(packageID)(manifest))
                .then(updateView)
                .then(res)
        } catch (e) {
            rej(e)
        }
    })
}