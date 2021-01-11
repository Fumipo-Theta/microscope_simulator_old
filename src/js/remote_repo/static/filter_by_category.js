/**
 * selectedRockType = {
 *  rock: ["igneous_rock", "rhyolite"],
 *  contains: []
 * }
 *
 * Current version can filter sample by rock type category.
 *
 * @param {*} sampleList
 * @param {*} categoryFilterQuery
 */
export default function filterSampleByCategories(sampleList, categoryFilterQuery) {
    return sampleList.filter((sample) => {
        const cat = sample.category
        return filterByRockType(cat.rock, categoryFilterQuery.rock)
    })
}

/**
 *
 * @param {Array} rockCat
 * @param {Array} rockQuery
 * @return {Boolean}
 */
function filterByRockType(rockCat, rockQuery) {
    return isSubset(new Set(rockQuery), new Set(rockCat))
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