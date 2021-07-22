import { RootState } from "@src/js/type/entity"
import loadImageSrc from "./loadImageSrc"

function selectImageInContainor(container, prefix) {
    if (prefix in container) {
        return container[prefix]
    }
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII="
}

export default function updateImageSrc(imagesMap, ext) {
    return (state: RootState) => new Promise(async (res, rej) => {
        const { viewerState } = state
        const image_number = viewerState.rotationHandler.getRequiredImageNumber()

        Promise.all([
            Promise.all(Array(image_number - 1).fill(0)
                .map((_, i) => selectImageInContainor(imagesMap, `o${i + 1}.${ext}`))
                .map(loadImageSrc)
            ),
            Promise.all(Array(image_number - 1).fill(0)
                .map((_, i) => selectImageInContainor(imagesMap, `c${i + 1}.${ext}`))
                .map(loadImageSrc)
            )
        ])
            .then(imgDOMs => {
                const open_imgs = imgDOMs[0]

                const cross_imgs = imgDOMs[1]

                return { open: open_imgs, cross: cross_imgs }
            })
            .then(setOpenAndCrossImages(state))
            .then(res)
    })
}

function setOpenAndCrossImages(state: RootState) {
    return async imgSets => {
        state.uiState.samplePackage.open_images = imgSets.open
        state.uiState.samplePackage.cross_images = imgSets.cross
        return (state)
    }
}