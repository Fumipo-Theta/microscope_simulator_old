/**
 * selectedRockType = {
 *  rock: ["igneous_rock", "rhyolite"],
 *  includes: []
 * }
 * 
 * @param {*} sampleListLoader 
 * @param {*} selectedCategories 
 */
export default function filterSampleByCategories(sampleList, selectedCategories) {
    return sampleList.filter((sample) => {
        const cat = sample.category
        return filterByRockType(cat.rock, selectedCategories.rock)
    })
}

/**
 * 
 * @param {*} rockCat 
 * @param {*} rockQuery 
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