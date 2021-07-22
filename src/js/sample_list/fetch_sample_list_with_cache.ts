import { staticSettings, cacheStorage } from "../config/config"

export default function fetchSampleListWithCache(sampleListName) {
    return new Promise(async (res, rej) => {
        const listURL = staticSettings.getSampleListURL(sampleListName);
        try {
            var response = await fetch(listURL, { mode: 'cors' })
                .catch((e) => { throw Error(e) })
                .then(r => r.json()) as { "list_of_sample": any }
            cacheStorage.put("list_of_sample", JSON.stringify(response["list_of_sample"]))
        } catch (e) {
            var stored_list = cacheStorage.get("list_of_sample")
            var response = { "list_of_sample": JSON.parse(stored_list) }
            rej(e)
        }
        res(response)
    })
}
