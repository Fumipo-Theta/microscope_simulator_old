/**
 * TODO split these config as different objects
 *
 * - Package list endpoint
 * - Package CDN endpoint
 * - Cache DB version name
 * - Cache DB table name
 */

class Config {
    constructor() {
        this.sampleListURL = compileEnv == "production"
            ? "https://d3uqzv7l1ih05d.cloudfront.net/rock_list.json"
            : "../../image_package_root/rock_list.json"
        this.imageDataRoot = compileEnv == "production"
            ? "https://d3uqzv7l1ih05d.cloudfront.net/packages/"
            : "../../image_package_root/packages/"

        this.indexedDBName = "db_v3"
        this.storageName = "files"
    }

    getSampleListURL() {
        return this.sampleListURL
    }

    getImageDataPath(packageName) {
        return this.imageDataRoot + packageName + "/"
    }

    getDBName() {
        return this.indexedDBName;
    }

    getStorageName() {
        return this.storageName
    }
}


const compileEnv = process.env.NODE_ENV

console.info("config.js: compileEnv: ", compileEnv)

export const staticSettings = new Config()

export const VIEW_PADDING = 0 // px
