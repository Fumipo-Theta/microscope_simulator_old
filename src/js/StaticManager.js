export default class StaticManager {
    constructor(
        sampleListURL,
        imageDataPathPrefix,
        dbName,
        storageName
    ) {
        this.sampleListURL = sampleListURL
        this.imageDataRoot = imageDataPathPrefix
        this.indexedDBName = dbName
        this.storageName = storageName
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
