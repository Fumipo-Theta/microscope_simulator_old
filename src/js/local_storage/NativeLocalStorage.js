export default class NativeLocalStorage {
    constructor() {
        this.db = window.localStorage
    }

    put(key, value) {
        this.db.setItem(key, value);
    }

    get(key) {
        const value = this.db.getItem(key)
        return (value == null)
            ? undefined
            : value
    }
}
