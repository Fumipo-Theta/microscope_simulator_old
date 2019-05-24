import { detectWebpSupport, detectJ2kSupport } from "./detect_supported_image.js"

export default async function getSupportedImageType() {
    if (await detectWebpSupport()) {
        return "webp"
    }
    if (await detectJ2kSupport()) {
        return "jp2"
    }
    return "jpg"
}
