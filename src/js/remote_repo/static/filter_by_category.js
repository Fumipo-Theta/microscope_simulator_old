export default class SampleFilter {
    constructor(queries = []) {
        this.queries = new Set(queries.map(this.listToQuery))
    }

    add(query) {
        this.queries.add(this.listToQuery(query))
    }

    addMany(queries) {
        queries.forEach(v => {
            this.queries.add(this.listToQuery(v))
        })
    }

    remove(value) {
        this.queries.delete(this.listToQuery(value))
    }

    removeMany(values) {
        values.forEach(v => {
            this.queries.delete(this.listToQuery(v))
        })
    }

    reset(queries) {
        this.queries = new Set(queries.map(this.listToQuery))
    }

    list() {
        return this.queries
    }

    listToQuery(path) {
        return path.reduce((acc, e) => {
            if (acc === "") return e
            return acc + "." + e
        }, "")
    }

    filter(sampleList) {
        if (this.queries.size === 0) return sampleList

        const queries = [...this.queries].map(v => v.split("."))
        return sampleList.filter(sample => {
            if (!sample.hasOwnProperty("category")) return false
            const superset = new Set(sample.category)
            for (let query of queries) {
                if (isSubset(query, superset)) return true
            }
        })
    }
}


/**
 *
 * @param {Set} set
 * @param {Set} superset
 */
function isSubset(set, superset) {
    if (set.size == 0) {
        return true
    }
    for (let elem of set) {
        if (!superset.has(elem)) {
            return false;
        }
    }
    return true;
}
