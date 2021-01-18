export default class SampleFilter {
    constructor(category = []) {
        this.category = new Set(category)
    }

    addCategory(value) {
        this.category.add(value)
    }

    addManyCategories(values) {
        values.forEach(v => {
            this.category.add(v)
        })
    }

    removeCategory(value) {
        this.category.delete(value)
    }

    removeManyCategories(values) {
        values.forEach(v => {
            this.category.delete(v)
        })
    }

    listCategory() {
        return this.category
    }

    isInclude(set) {

    }

    isSubset(set) {
        return isSubset(set, this.category)
    }

    filter(sampleList) {
        return sampleList.filter(sample => this._filterByCategory(sample))
    }

    _filterByCategory(sample) {
        if (!sample.hasOwnProperty("category")) return false

        return isSubset(new Set(sample.category), this.category)
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
