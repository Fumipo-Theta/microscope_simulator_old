import loadImageSrc from "./loadImageSrc.js"
import setOpenAndCrossImages from "./setOpenAndCrossImages.js"

/**
 * Check images are in containor.
 * If true, set them in state object.
 * else, create img element and set them in state object.
 */
const createImageContainor = state => new Promise((res, rej) => {

    Promise.all([
        Promise.all(state.open_image_srcs.map(src => loadImageSrc(src))),
        Promise.all(state.cross_image_srcs.map(src => loadImageSrc(src)))
    ])
        .then(imgDOMs => {
            const open_imgs = imgDOMs[0]

            const cross_imgs = imgDOMs[1]

            return { open: open_imgs, cross: cross_imgs }
        })
        .then(setOpenAndCrossImages(state))
        .then(res)

})
