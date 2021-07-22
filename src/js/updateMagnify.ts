import { RootState } from "@src/js/type/entity"
import { canvasCoordinate } from "./coordinate_updators"

export function updateMagnifyByPinch(state: RootState, e) {
    const { inputState, uiState: { sampleMeta }, viewerState } = state
    if (inputState.dragStart === undefined) return
    if (inputState.pinchStart === undefined) return

    const x1 = [...inputState.dragStart]
    const y1 = [...inputState.pinchStart]
    const x2 = [...inputState.dragEnd]
    const y2 = [...inputState.pinchEnd]

    const expansion = Math.sqrt((x2[0] - y2[0]) ** 2 + (x2[1] - y2[1]) ** 2) / Math.sqrt((x1[0] - y1[0]) ** 2 + (x1[1] - y1[1]) ** 2)

    const currentRadius = viewerState.imageCenterInfo.imageRadius
    const newRadius = (expansion > 2)
        ? currentRadius
        : currentRadius / expansion
    state.viewerState.imageCenterInfo.imageRadius =
        (newRadius) > sampleMeta.imageRadius ?
            sampleMeta.imageRadius :
            (newRadius < 100) ?
                100 :
                newRadius
    return state
}

export function updateMagnifyByWheel(state: RootState, e) {
    const scrolled = canvasCoordinate(e)[1]

    const currentRadius = state.viewerState.imageCenterInfo.imageRadius
    const newRadius = currentRadius + scrolled
    state.viewerState.imageCenterInfo.imageRadius =
        (newRadius) > state.uiState.sampleMeta.imageRadius ?
            state.uiState.sampleMeta.imageRadius :
            (newRadius < 100) ?
                100 :
                newRadius
    return state
}
