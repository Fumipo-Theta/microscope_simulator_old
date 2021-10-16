import React, { useEffect, useState, MutableRefObject, useRef } from "react"
import { useRecoilValue, useSetRecoilState, SetterOrUpdater } from "recoil"
import { useCanvas } from "@src/js/component/ViewerContainer/viewer/util/use_canvas"
import { ImageSource, SamplePackage, Scale } from "@src/js/type/entity"
import { supportedImageTypeState } from "@src/js/state/atom/supported_image_type_state"
import { isOpenNicolState } from "@src/js/state/atom/nicol_state"
import { scaleState } from "@src/js/state/atom/scale_state"
import RotationManager from "./util/rotation_manager_for_stepwise_photos"
import { renderOnCanvas } from "./util/sample_viewer"
import {
    UiState, getMaxViewerSize, getImageCenterInfo, updateImageSrc, getCoordinateOnCanvas,
    updateRotate, updateCoordinate, updateMagnifyByPinch
} from "./util/event_handler_util"

export type ViewerProps = {
    width: number,
    height: number,
    sample: SamplePackage
}

const style = {
    margin: "5px",
    borderRadius: "50%",
    boxShadow: "2px 1px 4px #a0a0a0, -2px -1px 4px #ffffff",
    overflow: "hidden",
}

export const Viewer: React.FC<ViewerProps> = ({ width, height, sample }) => {
    const { rotate_clockwise, cycle_rotate_degree, rotate_by_degree } = sample.manifest
    const rotationManager = new RotationManager(rotate_clockwise, rotate_by_degree, cycle_rotate_degree)
    const supportedImage = useRecoilValue(supportedImageTypeState)
    const viewerSize = getMaxViewerSize(width, height)
    const isOpenNicol = useRecoilValue(isOpenNicolState)
    const setScaleValue = useSetRecoilState(scaleState)

    const [imageSource, setImageSource] = useState<ImageSource>({ openImages: [], crossImages: [] })
    const [canvasRef, ref] = useCanvas()
    const [context, setContext] = useState<CanvasRenderingContext2D>(null)
    const [_cvs, setCvs] = useState<HTMLCanvasElement>(null)
    const handlerRef = useRef<HTMLDivElement>(null)
    const [handler, setHandler] = useState<HTMLDivElement>(null)
    const [rotate, setRotate] = useState(0)
    const [imageCenterInfo, setImageCenterInfo] = useState(getImageCenterInfo(sample.manifest))
    const state = useRef<UiState>({
        touching: false,
        isRotateClockwise: true,
        canRotate: false,
        rotate: 359.9,
        imageCenterInfo: getImageCenterInfo(sample.manifest)
    })

    useEffect(() => {
        if (handler) {
            return setViewerStateUpdateEventHandler(handler, state, sample, viewerSize, setRotate, setImageCenterInfo, setScaleValue)
        }
    }, [handler, sample])

    useEffect(() => {
        console.log(sample)
        state.current.rotate = 0
        state.current.imageCenterInfo = getImageCenterInfo(sample.manifest)
        setImageCenterInfo(getImageCenterInfo(sample.manifest))
        state.current.canRotate = false
        updateImageSrc(rotationManager.getRequiredImageNumber(), sample.thumbnail, "jpg")
            .then(setImageSource)
        sample.zip()
            .then(imageMap => updateImageSrc(rotationManager.getRequiredImageNumber(), imageMap, supportedImage))
            .then(setImageSource)
            .then(() => {
                state.current.rotate = 359.9
                state.current.canRotate = true
            })
            .catch(console.log)
        setScaleValue({
            label: sample?.manifest?.["scale-unit"],
            pixel: sample?.manifest?.["scale-pixel"],
            imageRadius: state.current.imageCenterInfo.imageRadius,
            viewerSize: viewerSize,
        })
    }, [sample])


    useEffect(() => {
        const canvas = (canvasRef as MutableRefObject<HTMLCanvasElement>).current
        const ctx = canvas.getContext("2d")
        setCvs(canvas)
        setContext(ctx)
        const handler = handlerRef.current
        setHandler(handler)
    }, [])


    /**
     * Render part
     */
    useEffect(() => {
        if (context) {
            renderOnCanvas(context)({
                imageSource,
                rotationHandler: rotationManager,
                canvasHeight: viewerSize,
                canvasWidth: viewerSize,
                imageCenterInfo: state.current.imageCenterInfo,
                isCrossNicol: !isOpenNicol,
                rotate: state.current.rotate
            })
        }
    }, [context, imageSource, isOpenNicol, imageCenterInfo, rotate, viewerSize])


    return <div style={{ width: viewerSize, height: viewerSize, ...style }}>
        <canvas ref={ref} width={viewerSize} height={viewerSize} style={{ borderRadius: "50%", }} />
        {
            // TODO: Fix the event handler layer is shifted downward by a few pixels
        }
        <div ref={handlerRef} style={{ width: viewerSize, height: viewerSize, position: "relative", top: -viewerSize, borderRadius: "50%", }} ></div>
    </div>
}

function setViewerStateUpdateEventHandler(
    handler: HTMLElement,
    state: React.MutableRefObject<UiState>,
    sample: SamplePackage,
    viewerSize: number,
    setRotate: React.Dispatch<React.SetStateAction<number>>,
    setImageCenterInfo: React.Dispatch<React.SetStateAction<{
        imageRadius: number;
        rotateCenterToRight: any;
        rotateCenterToBottom: any;
    }>>,
    setScaleValue: SetterOrUpdater<Scale>
) {
    const coordinateOnCanvas = getCoordinateOnCanvas(handler)
    const touchStartHandler = e => {
        state.current.touching = true
        state.current.dragEnd = coordinateOnCanvas(e)
        e.preventDefault()
    }
    const touchMoveHandler = e => {
        if (!state.current.touching) return
        if (e instanceof MouseEvent || e.touches.length === 1) {
            e.preventDefault()
            updateCoordinate(state, coordinateOnCanvas, e)
            updateRotate(state, viewerSize, e)
            setRotate(state.current.rotate)
        } else if (e.touches.length === 2) {
            e.preventDefault()
            updateCoordinate(state, coordinateOnCanvas, e)
            updateMagnifyByPinch(state, getImageCenterInfo(sample.manifest).imageRadius)
            setImageCenterInfo({ ...state.current.imageCenterInfo })
            setScaleValue((scale) => {
                return {
                    ...scale,
                    imageRadius: state.current.imageCenterInfo.imageRadius,
                    viewerSize: viewerSize,
                }
            })
        }
    }
    const touchEndHandler = e => {
        const { dragEnd, pinchEnd, ...rest } = state.current
        state.current = { ...rest, touching: false }
        e.preventDefault()
    }

    const wheelHandler = e => {
        const scrolled = coordinateOnCanvas(e)[1]
        const currentRadius = state.current.imageCenterInfo.imageRadius
        const newRadius = currentRadius + scrolled
        state.current.imageCenterInfo.imageRadius =
            newRadius > getImageCenterInfo(sample.manifest).imageRadius
                ? getImageCenterInfo(sample.manifest).imageRadius
                : newRadius < 100
                    ? 100
                    : newRadius
        setImageCenterInfo({ ...state.current.imageCenterInfo })
        setScaleValue((scale) => {
            return {
                ...scale,
                imageRadius: state.current.imageCenterInfo.imageRadius,
                viewerSize: viewerSize,
            }
        })
        e.preventDefault()
    }

    const preventDefault = (e) => { e.preventDefault() }

    handler.addEventListener("mousedown", touchStartHandler, false)
    handler.addEventListener("mousemove", touchMoveHandler, false)
    handler.addEventListener("mouseup", touchEndHandler, false)
    handler.addEventListener("touchstart", touchStartHandler, false)
    handler.addEventListener("touchmove", touchMoveHandler, false)
    handler.addEventListener("touchend", touchEndHandler, false)
    handler.addEventListener("dragstart", preventDefault, false)
    handler.addEventListener("drag", preventDefault, false)
    handler.addEventListener("dragend", preventDefault, false)
    handler.addEventListener("wheel", wheelHandler, false)

    return () => {
        handler.removeEventListener("mousedown", touchStartHandler)
        handler.removeEventListener("mousemove", touchMoveHandler)
        handler.removeEventListener("mouseup", touchEndHandler)
        handler.removeEventListener("touchstart", touchStartHandler)
        handler.removeEventListener("touchmove", touchMoveHandler)
        handler.removeEventListener("touchend", touchEndHandler)
        handler.removeEventListener("dragstart", preventDefault)
        handler.removeEventListener("drag", preventDefault)
        handler.removeEventListener("dragend", preventDefault)
        handler.removeEventListener("wheel", wheelHandler)
    }
}
