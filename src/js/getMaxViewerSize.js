export default function getMaxViewerSize() {
    const topBarSpaceHeight = 200 // px
    const width = window.innerWidth
    const height = window.innerHeight - topBarSpaceHeight
    return width < height ? width : height
}
