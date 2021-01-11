import fetchOrLookupSampleList from "../sample_list/fetch_sample_list_with_cache.js"
import showSampleList from "../sample_list/show_sample_list.js"
import SampleFilter from "../remote_repo/static/filter_by_category.js"

/**
 * 
 * Language = "en" | "ja"
 * SampleKeys: Array<String>
 *
 * @param {Language} uiLanguage
 * @param {SampleKeys} cachedSampleKeys
 * @param {SampleFilter} sampleFilter
 * @return {Promise}
 */
export default async function updateSampleList(uiLanguage, cachedSampleKeys, sampleFilter) {
    const responseJson = await fetchOrLookupSampleList()
    const samplesToBeShown = sampleFilter.filter(responseJson["list_of_sample"])
    showSampleList(samplesToBeShown, uiLanguage, cachedSampleKeys)
    return samplesToBeShown
}
