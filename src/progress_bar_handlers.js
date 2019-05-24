export function progressLoading(selector) {
    const progress = document.querySelector(selector)
    const bar = progress.querySelector(".bar")
    bar.style.width = "0%"
    const total = progress.clientWidth
    return e => {
        bar.style.width = `${(e.loaded / e.total) * 100}%`
    }
}

export function completeLoading(selector) {
    const progress = document.querySelector(selector)
    const bar = progress.querySelector(".bar")
    return e => {
        bar.style.width = "0%"
    }
}
