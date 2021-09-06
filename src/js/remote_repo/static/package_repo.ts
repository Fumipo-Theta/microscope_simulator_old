import { blobToBase64 } from "@src/js/data_translaters"
import { staticSettings } from "@src/js/config/config"
import { PackageId, SampleImageType, SamplePackageZipped } from "@src/js/type/entity"
import unzipper from "@src/js/unzipper"
import extractFile from "@src/js/extractFile"


/**
 * この関数の返り値の構造をもつobjectを返すのが責務。
 * よってこの関数で画像パッケージのunzipも行っている。
 *
 * @param {String} packageId
 * @returns {Promise}
 *     zip: Object<String, Image Blob>
 */
export const retrieve = async (packageId: PackageId, desiredFormat: SampleImageType): Promise<SamplePackageZipped> => {
    const manifestUrl = staticSettings.getImageDataPath(packageId) + "manifest.json";
    const open_thumbnailUrl = staticSettings.getImageDataPath(packageId) + "o1.jpg";
    const cross_thumbnailUrl = staticSettings.getImageDataPath(packageId) + "c1.jpg";
    const manifestText = await fetch(manifestUrl, { mode: 'cors' }).then(response => response.text())
    const manifest = JSON.parse(manifestText);

    const [zipUrl, format] = resolveImagePackage(packageId, desiredFormat, manifest)
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

export const getImagesLastModified = async (packageId, desiredImageFormat): Promise<[string, boolean]> => {
    const manifestUrl = staticSettings.getImageDataPath(packageId) + "manifest.json";
    const manifest = await fetch(manifestUrl, { mode: 'cors' }).then(response => response.json())
    const [zipUrl, _] = resolveImagePackage(packageId, desiredImageFormat, manifest)
    const [lastModified, networkDisconnected] = await queryLastModified(zipUrl)
    return [lastModified, networkDisconnected]
}

const resolveImagePackage = (packageId: PackageId, desiredFormat: SampleImageType, manifest): [string, SampleImageType] => {
    const format = manifest.hasOwnProperty('image_formats') && manifest["image_formats"] != null
        ? selectFormatWithFallbackToJpg(manifest.image_formats, desiredFormat)
        : desiredFormat
    return [staticSettings.getImageDataPath(packageId) + format + ".zip", format]
}

function selectFormatWithFallbackToJpg(list, format) {
    if (list.includes(format)) {
        return format
    } else {
        return "jpg"
    }
}


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

