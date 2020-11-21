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
export default function loadImageSrc(src) {
    return new Promise((res, rej) => {

        const img = new Image()

        img.onload = _ => {
            img.onnerror = null;
            res(img)
        }
        img.onerror = e => {
            res(img)
        }

        img.src = handleImgSrc(src)
    })
}
