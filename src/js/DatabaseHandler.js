export default class DatabaseHandler {
    constructor(db_name, version, storeName, primaryKeyName) {
        this.db = window.indexedDB;
        this.db_name = db_name;
        this.db_version = version;
        this.storeName = storeName;
        this.primaryKey = primaryKeyName;
    }

    schemeDef(db) {
        db.createObjectStore(this.storeName, { keyPath: this.primaryKey, autoIncrement: true });
    }

    connect() {
        const dbp = new Promise((resolve, reject) => {
            const req = this.db.open(this.db_name, this.db_version);
            req.onsuccess = ev => resolve(ev.target.result);
            req.onerror = ev => reject('fails to open db');
            req.onupgradeneeded = ev => this.schemeDef(ev.target.result);
        });
        dbp.then(d => d.onerror = ev => alert("error: " + ev.target.errorCode));
        return dbp;
    }

    async put(db, obj) { // returns obj in IDB
        return new Promise((resolve, reject) => {
            const docs = db.transaction([this.storeName], 'readwrite').objectStore(this.storeName);
            const req = docs.put(obj);
            req.onsuccess = () => resolve(Object.assign({ [this.primaryKey]: req.result }, obj));
            req.onerror = reject;
        });
    }

    async get(db, id) { // NOTE: if not found, resolves with undefined.
        return new Promise((resolve, reject) => {
            const docs = db.transaction([this.storeName,]).objectStore(this.storeName);
            const req = docs.get(id);
            req.onsuccess = () => resolve(req.result);
            req.onerror = reject;
        });
    }

    async delete(db, id) {
        return new Promise((resolve, reject) => {
            const docs = db.transaction([this.storeName,], 'readwrite')
                .objectStore(this.storeName);
            const req = docs.delete(id);
            req.onsuccess = () => resolve(id);
            req.onerror = reject;
        })
    }

    async loadAllKey(db) {
        return new Promise(async (resolve, reject) => {
            const saves = [];
            var range = IDBKeyRange.lowerBound(0);
            const req = db.transaction([this.storeName]).objectStore(this.storeName).openCursor(range);
            req.onsuccess = function (e) {
                var result = e.target.result;
                // 注）走査すべきObjectがこれ以上無い場合
                //     result == null となります！
                if (!!result == false) {
                    resolve(saves)
                } else {
                    // ここにvalueがくる！
                    saves.push(result.key);
                    // カーソルを一個ずらす
                    result.continue();
                }


            }
        });
    }

    async getAllKeys(db) {
        return new Promise(async (resolve, reject) => {
            try {
                var req = db.transaction([this.storeName]).objectStore(this.storeName)
            } catch (e) {
                return resolve([])
            }

            if (req.getAllKeys) {
                req.getAllKeys().onsuccess = function (event) {
                    const rows = event.target.result;
                    resolve(rows);
                }
            } else {
                const entries = await this.loadAllKey(db)
                resolve(entries)
            }
            req.onerror = reject
        })
    }
}
