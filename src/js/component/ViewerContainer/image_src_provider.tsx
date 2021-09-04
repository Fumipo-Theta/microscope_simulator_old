import React, { useEffect } from "react"
import { SetRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { SamplePackage, Manifest, ImageSource, SampleImageType } from "@src/js/type/entity"
import RotationManager from "./viewer/rotation_manager_for_stepwise_photos"
import { supportedImageTypeState } from "@src/js/state/atom/supported_image_type_state"
import { samplePackageState } from "@src/js/state/atom/sample_package_state"

type Props = {
    sample: SamplePackage,
    imageSetter: React.Dispatch<React.SetStateAction<ImageSource>>
}
export const ImageSrcProvider: React.FC<Props> = ({ sample, imageSetter, children }) => {
    const { rotate_clockwise, cycle_rotate_degree, rotate_by_degree } = sample.manifest
    const rotationManager = new RotationManager(rotate_clockwise, rotate_by_degree, cycle_rotate_degree)
    const supportedImage = useRecoilValue(supportedImageTypeState)

    useEffect(() => {
        updateImageSrc(rotationManager.getRequiredImageNumber(), sample.thumbnail, "jpg")
            .then(imageSetter)
    }, [rotationManager, imageSetter, sample])

    return <>{children}</>
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