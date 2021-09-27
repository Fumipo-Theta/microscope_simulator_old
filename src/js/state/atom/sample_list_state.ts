import { selector } from "recoil";
import { SampleList } from "@src/js/type/sample";
import { staticSettings } from "@src/js/config/config";
import { sampleListNameState } from "./sample_list_name_state";

export const sampleListSelector = selector<SampleList>({
    key: 'sampleListSelector',
    get: async ({ get }) => {
        const sampleListName = get(sampleListNameState)
        console.log("sample list name", sampleListName)
        return await fetchSampleList(sampleListName)
    }
})

const fetchSampleList = async (sampleListName: string): Promise<SampleList> => {
    if (sampleListName == '') return { "list_of_sample": [] }
    const listURL = staticSettings.getSampleListURL(sampleListName);
    console.log("sample list url", listURL)
    try {
        const response = await fetch(listURL, { mode: 'cors' })
            .catch((e) => { throw Error(e) })
            .then(r => r.json()) as { "list_of_sample": any }
        return { "list_of_sample": response.list_of_sample.map((item, i) => { return { ...item, globalIndex: i + 1 } }) }
    } catch (e) {
        return { "list_of_sample": [] }
    }
}