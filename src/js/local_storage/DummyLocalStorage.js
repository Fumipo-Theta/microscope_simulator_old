export default class DummyLocalStorage {
    constructor() {
        this.db = {}
    }

    put(key, value) {
        this.db[key] = value;
    }

    get(key) {
        return (this.db.hasOwnProperty("key"))
            ? this.db[key]
            : undefined
    }
}
