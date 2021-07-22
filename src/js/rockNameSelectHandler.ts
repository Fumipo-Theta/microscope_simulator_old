import { RootState, Manifest } from "@src/js/type/entity"
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
export default function rockNameSelectHandler(state: RootState) {
    return new Promise(async (res, rej) => {
        const rock_selector = document.querySelector("#rock_selector") as HTMLSelectElement
        const packageName = rock_selector.options[rock_selector.selectedIndex].value
        location.hash = packageName

        state.viewerState.canRotate = false;
        hideErrorMessage()
        showLoadingMessage()
        hideWelcomeBoard()
        showViewer()
        showNicolButton()

        try {
            const [response, isNewData] = await queryImagePackage(state, packageName);
            const manifest = JSON.parse(response.manifest) as Manifest;

            state.uiState.samplePackage = { ...response }
            const new_state = await updateStateByMeta(state)(packageName, manifest)
                .then(updateViewDescription)
                .then(updateImageSrc(response.thumbnail, "jpg"))
                .then(updateView)

            new_state.viewerState.canRotate = true

            if (isNewData) {
                response.zip = await response.zip()
            }

            updateImageSrc(response.zip, response.image_format)(new_state)
                .then(state => register(state as RootState, isNewData)(response))
                .then(markDownloadedOption(packageName)(manifest))
                .then(updateView)
                .then(res)
        } catch (e) {
            rej(e)
        }
    })
}
