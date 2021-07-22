/**
 * TODO split these config as different objects
 *
 * - Package list endpoint
 * - Package CDN endpoint
 * - Cache DB version name
 * - Cache DB table name
 */
import NativeLocalStorage from "../local_storage/NativeLocalStorage";
import DummyLocalStorage from "../local_storage/DummyLocalStorage";

class Config {
    private endpoint: String;
    private indexedDBName: String;
    private storageName: String;

    constructor() {
        this.endpoint = configJson.package_endpoint
        this.indexedDBName = "db_v3"
        this.storageName = "files"
    }

    getSampleListURL() {
        return this.endpoint + "/rock_list.json"
    }

    getSampleCategoryURL() {
        return this.endpoint + "/category.json"
    }

    getImageDataPath(packageName) {
        return this.endpoint + "/packages/" + packageName + "/"
    }

    getDBName() {
        return this.indexedDBName;
    }

    getStorageName() {
        return this.storageName
    }
}


const configJson = JSON.parse('@CONFIG_JSON@')

export const staticSettings = new Config()

export const VIEW_PADDING = 0 // px

export const cacheStorage = window.localStorage
    ? new NativeLocalStorage()
    : new DummyLocalStorage()
