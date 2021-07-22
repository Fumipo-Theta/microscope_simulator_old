import { PackageId, RootState, SampleImageType, SamplePackageZipped } from "@src/js/type/entity"
import { staticSettings } from "./config/config"
import sanitizeID from "./sanitizeID"
import { blobToBase64 } from "./data_translaters"
import unzipper from "./unzipper"
import extractFile from "./extractFile"


async function queryLastModified(url): Promise<[string, boolean]> {
    try {
        const header = await fetch(url, { method: 'HEAD', mode: 'cors' }).catch(e => {
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
    private state: RootState;
    constructor(state) {
        this.state = state
    }

    resolveImagePackage(packageId: PackageId, desiredFormat: SampleImageType, manifest): [String, SampleImageType] {
        function selectFormatWithFallbackToJpg(list, format) {
            if (list.includes(format)) {
                return format
            } else {
                return "jpg"
            }
        }
        const format = manifest.hasOwnProperty('image_formats') && manifest["image_formats"] != null
            ? selectFormatWithFallbackToJpg(manifest.image_formats, desiredFormat)
            : desiredFormat
        console.log(format)
        return [staticSettings.getImageDataPath(packageId) + format + ".zip", format]
    }

    /**
     * この関数の返り値の構造をもつobjectを返すのが責務。
     * よってこの関数で画像パッケージのunzipも行っている。
     *
     * @param {String} packageId
     * @returns {Promise}
     *     zip: Object<String, Image Blob>
     */
    async retrieve(packageId: PackageId, desiredFormat: SampleImageType): Promise<SamplePackageZipped> {
        const manifestUrl = staticSettings.getImageDataPath(packageId) + "manifest.json";
        const open_thumbnailUrl = staticSettings.getImageDataPath(packageId) + "o1.jpg";
        const cross_thumbnailUrl = staticSettings.getImageDataPath(packageId) + "c1.jpg";
        const manifestText = await fetch(manifestUrl, { mode: 'cors' }).then(response => response.text())
        const manifest = JSON.parse(manifestText);

        const [zipUrl, format] = this.resolveImagePackage(packageId, desiredFormat, manifest)
        const [lastModified, _] = await queryLastModified(zipUrl)
        const unzipped = async () => unzipper(zipUrl).then(extractFile)

        const response = {
            manifest: manifestText, // もしIndexedDBにObjectを保存できるならシリアライズ不要
            thumbnail: {
                "o1.jpg": await fetch(open_thumbnailUrl, { mode: 'cors' })
                    .then(response => response.blob())
                    .then(blobToBase64),
                "c1.jpg": await fetch(cross_thumbnailUrl, { mode: 'cors' })
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

    async getImagesLastModified(packageId, desiredImageFormat) {
        const manifestUrl = staticSettings.getImageDataPath(packageId) + "manifest.json";
        const manifest = await fetch(manifestUrl, { mode: 'cors' }).then(response => response.json())
        const [zipUrl, _] = this.resolveImagePackage(packageId, desiredImageFormat, manifest)
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
 * @param {RootState} state
 * @param {String} packageName
 * @return {Array[Object,Boolean]} [response, toBeStored]
 */
export default async function queryImagePackage(
    state: RootState,
    packageName
) {
    const { viewerState: { supportedImageType } } = state
    const id = sanitizeID(packageName)
    const storedData = await state.cacheStorage.handler.get(state.cacheStorage.repo, id)
    const repo = new AdhocPackageRepo(state)
    const [lastModified, networkDisconnected] = await repo.getImagesLastModified(id, supportedImageType)

    if (storedData && storedData.lastModified === lastModified) {
        var toBeStored = false
        return [storedData, toBeStored]
    }
    if (networkDisconnected) {
        if (storedData) {
            var toBeStored = false
            return [storedData, toBeStored]
        } else {
            return [null, false]
        }
    } else {
        const response = await repo.retrieve(id, supportedImageType)
        var toBeStored = true
        return [response, toBeStored]
    }
}
