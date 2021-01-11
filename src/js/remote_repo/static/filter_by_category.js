export default class SampleFilter {
    constructor(category = []) {
        this.category = new Set(category)
    }

    appendCategory(value) {
        this.category.add(value)
    }

    deleteCategory(value) {
        this.category.delete(value)
    }

    filter(sampleList) {
        return sampleList.filter(sample => this._filterByCategory(sample))
    }

    _filterByCategory(sample) {
        if (!sample.hasOwnProperty("category")) return false

        return isSubset(this.category, new Set(sample.category))
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