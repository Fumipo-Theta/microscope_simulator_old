/**
 * TODO split these config as different objects
 *
 * - Package list endpoint
 * - Package CDN endpoint
 * - Cache DB version name
 * - Cache DB table name
 */
import NativeLocalStorage from "../local_storage/NativeLocalStorage.js";
import DummyLocalStorage from "../local_storage/DummyLocalStorage.js";

class Config {
    constructor() {
        this.endpoint = compileEnv == "production"
            ? "https://d3uqzv7l1ih05d.cloudfront.net/"
            : "../../image_package_root/"

        this.indexedDBName = "db_v3"
        this.storageName = "files"
    }

    getSampleListURL() {
        return this.endpoint + "rock_list.json"
    }

    getSampleCategoryURL() {
        return this.endpoint + "category.json"
    }

    getImageDataPath(packageName) {
        return this.endpoint + "packages/" + packageName + "/"
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

export const cacheStorage = window.localStorage
    ? new NativeLocalStorage()
    : new DummyLocalStorage()