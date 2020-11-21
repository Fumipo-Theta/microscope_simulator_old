export default function setOpenAndCrossImages(state) {
    return imgSets => new Promise((res, rej) => {
        state.open_images = imgSets.open
        state.cross_images = imgSets.cross
        res(state)
    })
}
