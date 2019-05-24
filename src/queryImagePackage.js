import { staticSettings } from "./global_objects.js"
import imagePackageFetcher from "./imagePackageFetcher.js"
import sanitizeID from "./sanitizeID.js"
import { blobToBase64 } from "./data_translaters.js"
/**
 * 指定したkeyのデータがDBの中にある場合, DBからデータを取得する.
 * サーバとDBでデータの最終更新時刻が一致すれば,
 *  DBのデータを返す.
 * ネットワークエラーの場合, DBのデータか無を返す
 *
 * そうでなければサーバからmanifestとsumbnailを取得して返す.
 * また, 画像本体のzipファイルをfetchするアクションを起こす関数を返す.
 *
 * @param {Object} state
 * @param {String} packageName
 * @param {String} lastModified_remote
 * @param {Boolean} networkDisconnected
 * @return {Array[Object,Boolean, function]} [response, toBeStored, zipLoader]
 */
export default async function queryImagePackage(
    state,
    packageName,
    lastModified_remote,
    networkDisconnected
) {
    const key = sanitizeID(packageName)
    const storedData = await state.zipDBHandler.get(state.zipDB, key)

    if (storedData !== undefined && storedData.lastModified === lastModified_remote) {
        var toBeStored = false
        return [storedData, toBeStored, null]
    }
    if (networkDisconnected) {
        if (storedData !== undefined) {
            var toBeStored = false
            return [storedData, toBeStored, null]
        } else {
            return [null, false, null]
        }
    } else {
        const manifestUrl = staticSettings.getImageDataPath(packageName) + "manifest.json";
        const open_thumbnailUrl = staticSettings.getImageDataPath(packageName) + "o1.jpg";
        const cross_thumbnailUrl = staticSettings.getImageDataPath(packageName) + "c1.jpg";
        const zipUrl = staticSettings.getImageDataPath(packageName) + state.supportedImageType + ".zip"
        const response = {
            manifest: await fetch(manifestUrl)
                .then(response => response.text()),
            thumbnail: {
                "o1.jpg": await fetch(open_thumbnailUrl)
                    .then(response => response.blob())
                    .then(blobToBase64),
                "c1.jpg": await fetch(cross_thumbnailUrl)
                    .then(response => response.blob())
                    .then(blobToBase64)
            },
            id: key,
            lastModified: lastModified_remote,
            zip: null,
        }
        var toBeStored = true
        const zipLoader = imagePackageFetcher(zipUrl)
        return [response, toBeStored, zipLoader]
    }
}
