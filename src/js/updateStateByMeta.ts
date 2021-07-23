import { Manifest, PackageId, RootState, SampleMeta } from "@src/js/type/entity";
import sanitizeID from "./sanitizeID"
import RotationHandler from '@src/js/component/ViewerContainer/viewer/rotation_manager_for_stepwise_photos'

function getRotationCenter(meta: Manifest) {
    return (meta.hasOwnProperty("rotate_center"))
        ? {
            fromLeft: meta.rotate_center[0],
            fromTop: meta.rotate_center[1]
        }
        : {
            fromLeft: meta.image_width * 0.5,
            fromTop: meta.image_height * 0.5
        }
}

function getImageRadius(meta) {
    const shift = getRotationCenter(meta);
    const image_center = {
        "x": meta.image_width * 0.5,
        "y": meta.image_height * 0.5
    }
    return Math.min(
        image_center.x - Math.abs(image_center.x - shift.fromLeft),
        image_center.y - Math.abs(image_center.y - shift.fromTop)
    )
}

function formatMetadata(meta: Manifest): SampleMeta {
    const scale = meta["scale-unit"] && meta["scale-pixel"] ?
        { scaleText: meta["scale-unit"], scaleWidth: meta["scale-pixel"] } :
        {}

    return {
        isClockwise: meta.rotate_clockwise,
        location: meta.location,
        rockType: meta.rock_type,
        owner: meta.owner,
        description: meta.description || meta.discription,
        rotateCenter: getRotationCenter(meta),
        imageWidth: meta.image_width,
        imageHeight: meta.image_height,
        imageRadius: getImageRadius(meta),
        scale: scale,
        rotateDegreeStep: meta.rotate_by_degree
    }
}

export default function updateStateByMeta(state: RootState) {
    return async (sampleId: PackageId, meta: Manifest) => {

        state.uiState.sampleId = sanitizeID(sampleId);
        state.viewerState.rotationHandler = new RotationHandler(
            meta.rotate_clockwise,
            meta.rotate_by_degree,
            meta.cycle_rotate_degree || 90
        )

        state.viewerState.rotate = 359;
        const { fromLeft, fromTop } = getRotationCenter(meta)
        state.viewerState.imageCenterInfo = {
            imageRadius: getImageRadius(meta),
            rotateCenterToBottom: fromTop,
            rotateCenterToRight: fromLeft
        }

        state.uiState.sampleMeta = formatMetadata(meta)

        return (state)
    }
}
