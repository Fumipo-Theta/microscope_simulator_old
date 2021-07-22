import { Language } from '@src/js/type/entity'
import fetchOrLookupSampleList from "../sample_list/fetch_sample_list_with_cache"
import showSampleList from "../sample_list/show_sample_list"
import SampleFilter from "../remote_repo/static/filter_by_category"

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
export default async function updateSampleList(uiLanguage: Language, cachedSampleKeys: Array<string>, sampleFilter, sampleListName?: string) {
    const responseJson = await fetchOrLookupSampleList(sampleListName) // sampleFilter should be passed to this function
    const samplesToBeShown = sampleFilter.filter(responseJson["list_of_sample"])
    showSampleList(samplesToBeShown, uiLanguage, cachedSampleKeys)
    return samplesToBeShown
}
