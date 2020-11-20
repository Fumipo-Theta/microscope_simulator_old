import { staticSettings } from "./global_objects.js"
import sanitizeID from "./sanitizeID.js"
import { blobToBase64 } from "./data_translaters.js"
import unzipper from "./unzipper.js"
import extractFile from "./extractFile.js"

/**
 *
 * @param {String} url
 * @return {Array[String, Boolean]} [lastModified, networkDisconnected]
 */
async function queryLastModified(url) {
    try {
        const header = await fetch(url, { method: 'HEAD' }).catch(e => {
            console.log("Package metadata cannot be fetched.")
            throw Error(e)
        })
        var lastModified = header.headers.get("last-modified")
        var networkDisconnected = false
        return [lastModified, networkDisconnected]
    } catch (e) {
        var lastModified = "none"
        var networkDisconnected = true
        return [lastModified, networkDisconnected]
    }
}

class AdhocPackageRepo {
    constructor(state) {
        this.state = state
    }

    resolveImagePackage(packageId, manifest) {
        const format = manifest.hasOwnProperty('image_format_only')
            ? manifest.image_format_only
            : this.state.supportedImageType
        console.log(format)
        return [staticSettings.getImageDataPath(packageId) + format + ".zip", format]
    }

    /**
     * 
     * @param {String} packageId
     * @returns {Promise}
     *     zip: Object<String, Image Blob>
     */
    async retrieve(packageId) {
        const manifestUrl = staticSettings.getImageDataPath(packageId) + "manifest.json";
        const open_thumbnailUrl = staticSettings.getImageDataPath(packageId) + "o1.jpg";
        const cross_thumbnailUrl = staticSettings.getImageDataPath(packageId) + "c1.jpg";
        const manifestText = await fetch(manifestUrl).then(response => response.text())
        const manifest = JSON.parse(manifestText);

        const [zipUrl, format] = this.resolveImagePackage(packageId, manifest)
        const [lastModified, _] = await queryLastModified(zipUrl)
        const unzipped = await unzipper(zipUrl).then(extractFile)

        const response = {
            manifest: manifestText,
            thumbnail: {
                "o1.jpg": await fetch(open_thumbnailUrl)
                    .then(response => response.blob())
                    .then(blobToBase64),
                "c1.jpg": await fetch(cross_thumbnailUrl)
                    .then(response => response.blob())
                    .then(blobToBase64)
            },
            lastModified: lastModified,
            id: packageId,
            zip: unzipped,
            image_format: format
        }
        return response
    }

    async getImagesLastModified(packageId) {
        const manifestUrl = staticSettings.getImageDataPath(packageId) + "manifest.json";
        const manifest = await fetch(manifestUrl).then(response => response.json())
        const [zipUrl, _] = this.resolveImagePackage(packageId, manifest)
        const [lastModified, networkDisconnected] = await queryLastModified(zipUrl)
        return [lastModified, networkDisconnected]
    }
}

/**
 * 指定したkeyのデータがDBの中にある場合, DBからデータを取得する.
 * サーバとDBでデータの最終更新時刻が一致すれば,
 *  DBのデータを返す.
 * ネットワークエラーの場合, DBのデータか無を返す
 *
 * そうでなければサーバからmanifestとthumbnailを取得して返す.
 * また, 画像本体のzipファイルをfetchするアクションを起こす関数を返す.
 *
 * @param {Object} state
 * @param {String} packageName
 * @return {Array[Object,Boolean]} [response, toBeStored]
 */
export default async function queryImagePackage(
    state,
    packageName
) {
    const id = sanitizeID(packageName)
    const storedData = await state.zipDBHandler.get(state.zipDB, id)
    const repo = new AdhocPackageRepo(state)
    const [lastModified, networkDisconnected] = await repo.getImagesLastModified(id)

    if (storedData !== undefined && storedData.lastModified === lastModified) {
        var toBeStored = false
        return [storedData, toBeStored]
    }
    if (networkDisconnected) {
        if (storedData !== undefined) {
            var toBeStored = false
            return [storedData, toBeStored]
        } else {
            return [null, false]
        }
    } else {
        const response = await repo.retrieve(id)
        var toBeStored = true
        return [response, toBeStored]
    }
}
