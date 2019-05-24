import { detectWebpSupport, detectJ2kSupport } from "./detect_supported_image.js"
import getSupportedImageType from "./getSupportedImageType.js"

export default async function checkSupportedImageFormat(state) {
    state.supportWebp = await detectWebpSupport();
    state.supportJ2k = await detectJ2kSupport();
    state.supportedImageType = await getSupportedImageType();
    return state
}
