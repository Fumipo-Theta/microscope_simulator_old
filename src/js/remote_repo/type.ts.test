/**
 * Package: {
 *  manifest: PackageMetadata (Object),
 *  thumbnail: {
 *      "o1.jpg": Base64 (String),
 *      "c1.jpg": Base64 (String)
 *  },
 *  lastModified: ISO8601 (String),
 *  id: PackageId (String),
 *  zip: Object<FileName, Base64>,
 *  image_format: ImageType ("jpg" | "webp" | "jp2")
 * }
 */

type Base64 = String
type SampleImageType = 'jpg' | 'webp' | 'jp2'

type Package = {
    manifest: String,
    thumbnail: {
        "o1.jpg": Base64,
        "c1.jpg": Base64
    },
    lastModified: String,
    id: String,
    image_format: SampleImageType
}

class IRemoteRepo {
    constructor(state) {
        this.state = state
    }

    /**
     * この関数の返り値の構造をもつobjectを返すのが責務。
     * よってこの関数で画像パッケージのunzipも行っている。
     * 
     * @param {String} packageId
     * @returns {Promise}
     *     zip: Object<String, Image Blob>
     */
    async retrieve(packageId, desiredFormat): Promise<Package>

    /**
     * パケージのメタデータの更新日時を返す
     * @param {*} packageId 
     * @param {*} desiredFormat 
     */
    async getImagesLastModified(packageId, desiredFormat) {
        const manifestUrl = staticSettings.getImageDataPath(packageId) + "manifest.json";
        const manifest = await fetch(manifestUrl, { mode: 'cors' }).then(response => response.json())
        const [zipUrl, _] = this.resolveImagePackage(packageId, desiredFormat, manifest)
        const [lastModified, networkDisconnected] = await queryLastModified(zipUrl)
        return [lastModified, networkDisconnected]
    }
}

interface IFilterSample {

}