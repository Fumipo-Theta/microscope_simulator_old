import setOpenAndCrossImages from "./setOpenAndCrossImages.js"
import loadImageSrc from "./loadImageSrc.js"

function selectImageInContainor(containor, prefix) {
    if (prefix in containor) {
        return containor[prefix]
    }
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII="
}

export default function updateImageSrc(imagesMap, type) {
    return (state) => new Promise(async (res, rej) => {

        Promise.all([
            Promise.all(Array(state.image_number - 1).fill(0)
                .map((_, i) => selectImageInContainor(imagesMap, `o${i + 1}.${type}`))
                .map(loadImageSrc)
            ),
            Promise.all(Array(state.image_number - 1).fill(0)
                .map((_, i) => selectImageInContainor(imagesMap, `c${i + 1}.${type}`))
                .map(loadImageSrc)
            )
        ]).then(imgDOMs => {
            const open_imgs = imgDOMs[0]

            const cross_imgs = imgDOMs[1]

            return { open: open_imgs, cross: cross_imgs }
        })
            .then(setOpenAndCrossImages(state))
            .then(res)
    })
}
