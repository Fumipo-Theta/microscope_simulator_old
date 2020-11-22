function progressHandler(evt) {
    const open_progress = progressCircle("#open-progress")
    const cross_progress = progressCircle("#cross-progress")
    const load = (100 * evt.loaded / evt.total | 0);
    open_progress(load * 0.01)
    cross_progress(load * 0.01)
}

function completeHandler() {
    const open_progress = progressCircle("#open-progress")
    const cross_progress = progressCircle("#cross-progress")
    open_progress(0)
    cross_progress(0)
}

const unziper = (url) => new Promise((res, rej) => {
    Zip.inflate_file(url, res, rej, progressHandler, completeHandler)
})
