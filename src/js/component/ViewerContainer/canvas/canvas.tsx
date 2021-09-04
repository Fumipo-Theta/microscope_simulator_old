import React, { useEffect, useState, useRef, MutableRefObject } from "react"
import { SetRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { useCanvas } from "@src/js/component/ViewerContainer/viewer/use_canvas"
import { ImageSource, SamplePackage, SampleImageType } from "@src/js/type/entity"

import { supportedImageTypeState } from "@src/js/state/atom/supported_image_type_state"
import RotationManager from "../viewer/rotation_manager_for_stepwise_photos"
import { renderOnCanvas } from "../viewer/sample_viewer"

export type CanvasProps = {
    width: number,
    height: number,
    sample: SamplePackage
}

const getMaxViewerSize = (windowWidth, windowHeight) => {
    const padding = 20 // px
    const navigationAndNicolHeight = 64 + 100 + 20 // px
    const width = windowWidth
    const height = windowHeight - navigationAndNicolHeight
    return (width < height ? width : height) - padding
}

export const Canvas: React.FC<CanvasProps> = ({ width, height, sample }) => {
    const { rotate_clockwise, cycle_rotate_degree, rotate_by_degree } = sample.manifest
    const rotationManager = new RotationManager(rotate_clockwise, rotate_by_degree, cycle_rotate_degree)
    const supportedImage = useRecoilValue(supportedImageTypeState)
    const viewerSize = getMaxViewerSize(width, height)

    const onClick = (e) => { console.log("canvas clicked") }
    const addHandlers = (canvas: HTMLCanvasElement) => {
        canvas.addEventListener("click", onClick, false)
    }
    const removeHandlers = (canvas: HTMLCanvasElement) => {
        canvas.removeEventListener("click", onClick)
    }

    const [imageSource, setImageSource] = useState<ImageSource>({ openImages: [], crossImages: [] })
    const [canvasRef, ref] = useCanvas(addHandlers, removeHandlers)

    useEffect(() => {
        updateImageSrc(rotationManager.getRequiredImageNumber(), sample.thumbnail, "jpg")
            .then(setImageSource)
        sample.zip()
            .then(imageMap => updateImageSrc(rotationManager.getRequiredImageNumber(), imageMap, supportedImage))
            .then(setImageSource)
            .catch(console.log)
    }, [sample])

    const [context, setContext] = useState<CanvasRenderingContext2D>(null)
    useEffect(() => {
        const canvas = (canvasRef as MutableRefObject<HTMLCanvasElement>).current
        const ctx = canvas.getContext("2d")
        setContext(ctx)
    }, [])

    useEffect(() => {
        if (context) {
            renderOnCanvas(context)(imageSource, rotationManager)
        }
    }, [context, imageSource])
    return <canvas ref={ref} width={viewerSize} height={viewerSize} />
}


async function updateImageSrc(imageNumber, imagesMap, ext: SampleImageType): Promise<ImageSource> {
    const repeats = Array(imageNumber - 1).fill(0)

    return await Promise.all([
        Promise.all(repeats
            .map((_, i) => selectImageInContainer(imagesMap, `o${i + 1}.${ext}`))
            .map(loadImageSrc)
        ),
        Promise.all(repeats
            .map((_, i) => selectImageInContainer(imagesMap, `c${i + 1}.${ext}`))
            .map(loadImageSrc)
        )
    ])
        .then(imgDOMs => {
            const open_imgs = imgDOMs[0] as CanvasImageSource[]

            const cross_imgs = imgDOMs[1] as CanvasImageSource[]

            return { openImages: open_imgs, crossImages: cross_imgs }
        })
}

function selectImageInContainer(container, prefix) {
    if (prefix in container) {
        return container[prefix]
    }
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII="
}


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
function loadImageSrc(src) {
    return new Promise((res, rej) => {

        const img = new Image()

        img.onload = _ => {
            img.onerror = null;
            res(img)
        }
        img.onerror = e => {
            res(img)
        }

        img.src = handleImgSrc(src)
    })
}