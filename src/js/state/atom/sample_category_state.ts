import { atom, selector } from "recoil";
import { SampleCategories } from "@src/js/type/sample";
import { staticSettings } from "@src/js/config/config";
import { SampleCategoriesKeys, ROOT_CATEGORY_ID } from "@src/js/type/sample";

export const sampleCategoriesSelector = selector<SampleCategories>({
    key: 'sampleCategoriesSelector',
    get: async ({ get }) => {
        const sampleListName = get(sampleCategoriesNameState)
        console.log("sample list name", sampleListName)
        return await fetchSampleCategories(sampleListName)
    }
})

export const currentCategoryState = atom<string>({
    key: 'currentCategory',
    default: ROOT_CATEGORY_ID
})

export const sampleCategoriesNameState = atom<string>({
    key: 'sampleCategoriesName',
    default: ''
})

const fetchSampleCategories = async (sampleCategoriesName: string): Promise<SampleCategories> => {
    if (sampleCategoriesName == '') return { [SampleCategoriesKeys.Categories]: [] }
    const listURL = staticSettings.getSampleCategoryURL(sampleCategoriesName);
    console.log("sample list url", listURL)
    try {
        const response = await fetch(listURL, { mode: 'cors' })
            .catch((e) => { throw Error(e) })
            .then(r => r.json()) as SampleCategories
        return response
    } catch (e) {
        return { [SampleCategoriesKeys.Categories]: [] }
    }
}