import { RootState } from "@src/js/type/entity"

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

function selectImageInContainor(container, prefix) {
    if (prefix in container) {
        return container[prefix]
    }
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII="
}

function setOpenAndCrossImages(state: RootState) {
    return async imgSets => {
        state.uiState.samplePackage.open_images = imgSets.open
        state.uiState.samplePackage.cross_images = imgSets.cross
        return (state)
    }
}

function handleImgSrc(src) {
    if (src instanceof Blob) {
        const url = window.URL || window.webkitURL;
        return url.createObjectURL(src)
    } else if (src instanceof String) {
        return src
    } else {
        return src
    }
}

/**
 * @parameter src {dataURL}
 */
function loadImageSrc(src) {
    return new Promise((res, rej) => {

        const img = new Image()

        img.onload = _ => {
            img.onerror = null;
            res(img)
        }
        img.onerror = e => {
            res(img)
        }

        img.src = handleImgSrc(src)
    })
}
