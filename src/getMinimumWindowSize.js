export default function getMinimumWindowSize() {
    const width = window.innerWidth
    const height = window.innerHeight - 200
    return width < height ? width : height
}
