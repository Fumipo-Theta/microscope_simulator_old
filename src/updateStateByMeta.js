import sanitizeID from "./sanitizeID.js"
import { cycleBy, stepBy } from "./rotation_degree_handlers.js"

function getRotationCenter(meta) {
    return (meta.hasOwnProperty("rotate_center"))
        ? {
            "to_right": meta.rotate_center[0],
            "to_bottom": meta.rotate_center[1]
        }
        : {
            "to_right": meta.image_width * 0.5,
            "to_bottom": meta.image_height * 0.5
        }
}

function getImageRadius(meta) {
    const shift = getRotationCenter(meta);
    const image_center = {
        "x": meta.image_width * 0.5,
        "y": meta.image_height * 0.5
    }
    return Math.min(
        image_center.x - Math.abs(image_center.x - shift.to_right),
        image_center.y - Math.abs(image_center.y - shift.to_bottom)
    )
}

export default function updateStateByMeta(state) {
    return (containorID, meta) => new Promise((res, rej) => {

        state.containorID = sanitizeID(containorID);
        state.isClockwise = meta.rotate_clockwise
        state.location = (meta.hasOwnProperty("location"))
            ? meta.location
            : "Unknown"
        state.rockType = (meta.hasOwnProperty("rock_type"))
            ? meta.rock_type
            : "Unknown"
        state.owner = (meta.hasOwnProperty("owner"))
            ? meta.owner
            : "Unknown"
        state.discription = (meta.hasOwnProperty("discription"))
            ? meta.discription
            : "No discription. "
        state.rotate_center = getRotationCenter(meta)

        state.imageWidth = meta.image_width;
        state.imageHeight = meta.image_height;



        state.imageRadius = getImageRadius(meta)
        state.imageRadiusOriginal = getImageRadius(meta)
        state.scaleWidth = (meta.hasOwnProperty("scale-pixel"))
            ? parseInt(meta["scale-pixel"])
            : false
        state.scaleText = (meta.hasOwnProperty("scale-unit"))
            ? meta["scale-unit"]
            : false


        const rotate_degree_step = meta.rotate_by_degree
        const cycle_degree = meta.hasOwnProperty("cycle_rotate_degree")
            ? parseInt(meta.cycle_rotate_degree)
            : 90;
        const image_number = cycle_degree / rotate_degree_step + 1
        state.image_number = image_number
        const mirror_at = (image_number - 1)
        const total_step = (image_number - 1) * 2

        state.getImageNumber = cycle_degree > 0
            ? degree => cycleBy(image_number - 1)(
                stepBy(rotate_degree_step)(state.isClockwise ? 360 - degree : degree)
            )
            : degree => mirrorBy(mirror_at)(
                cycleBy(total_step)(
                    stepBy(rotate_degree_step)(degree)
                )
            )

        state.getAlpha = degree => {
            const nth = cycleBy(total_step * 2)(
                stepBy(rotate_degree_step)(degree)
            )
            return 1 - (degree - rotate_degree_step * nth) / rotate_degree_step
        }

        state.open_images = []
        state.cross_images = []

        state.rotate = 0;

        res(state)
    })
}
