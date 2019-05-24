export default function radiunBetween(cx, cy) {
    return (_x1, _y1, _x2, _y2) => {
        const x1 = _x1 - cx
        const x2 = _x2 - cx
        const y1 = _y1 - cy
        const y2 = _y2 - cy

        const cos = (x1 * x2 + y1 * y2) / Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2))
        return Math.sign(x1 * y2 - x2 * y1) * Math.acos(cos)
    }
}
