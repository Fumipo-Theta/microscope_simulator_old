export default function getCoordinateOnCanvas(canvas) {
    return (e, fingur = 0) => {
        if (e instanceof MouseEvent) {
            return (e instanceof WheelEvent)
                ? [
                    e.deltaX,
                    e.deltaY
                ]
                : [
                    e.pageX - canvas.offsetLeft,
                    e.pageY - canvas.offsetTop
                ]
        } else if (e instanceof TouchEvent && e.touches.length > fingur) {
            return [
                e.touches[fingur].pageX - canvas.offsetLeft,
                e.touches[fingur].pageY - canvas.offsetTop
            ]
        }
    }
}
