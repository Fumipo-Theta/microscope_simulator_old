import { staticSettings } from "./global_objects.js"
import queryLastModified from "./queryLastModified.js"
import queryImagePackage from "./queryImagePackage.js"

/**
 * パッケージのメタデータを取得する.
 * @param {*} state
 * @param {String} packageName
 */
export default function getPackageMetaData(state, packageName) {
    return new Promise(async (res, rej) => {


        const imageType = state.supportedImageType

        const packageUrl = staticSettings.getImageDataPath(packageName) + imageType + ".zip"
        const [lastModified, networkDisconnected] = await queryLastModified(packageUrl)

        const packageMetaData = await queryImagePackage(state, packageName, lastModified, networkDisconnected)

        res(packageMetaData)
    })
}
