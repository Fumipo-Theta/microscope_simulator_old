// Deprecated
export default function clipGeometoryFromImageCenter(state) {

    return [
        state.rotate_center.to_right - state.imageRadius,
        state.rotate_center.to_bottom - state.imageRadius,
        state.imageRadius * 2,
        state.imageRadius * 2
    ]
}
