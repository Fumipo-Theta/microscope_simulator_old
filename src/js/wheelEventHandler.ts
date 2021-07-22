import { RootState } from "@src/js/type/entity";
import wheelImage from "./wheelImage"

export const wheelHandler = (state: RootState) => e => {
    e.preventDefault();
    requestAnimationFrame(
        wheelImage(state, e)
    )
}
