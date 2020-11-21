import DatabaseHandler from "./DatabaseHandler.js"

export default class DummyDatabaseHandler extends DatabaseHandler {
    constructor(db_name, version, storeName, primaryKeyName) {
        console.warn("IndexedDB is not available !")
        super(db_name, version, storeName, primaryKeyName)
        this.storage = {}
    }

    connect() {
        return {}
    }

    put(db, obj) {
        if (db.hasOwnProperty(obj[this.primaryKey])) {
            var old = db[obj[this.primaryKey]]
        } else {
            var old = {}
        }
        const new_entry = Object.assign(old, obj)
        db[obj[this.primaryKey]] = new_entry;
        return { [obj[this.primaryKey]]: new_entry }
    }

    get(db, id) {
        if (db.hasOwnProperty(id)) {
            return db[id]
        } else {
            return undefined
        }
    }

    delete(db, id) {
        if (db.hasOwnProperty(id)) {
            db[id] = null;
            return id
        } else {
            return undefined
        }
    }

    loadAll(db) {
        return Object.entries(db)
    }

    getAllKeys(db) {
        return Object.keys(db)
    }
}
