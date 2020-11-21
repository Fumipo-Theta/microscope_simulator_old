import { staticSettings } from "./config.js"
import { showErrorMessage } from "./error_indicator_handler.js"
import showSampleList from "./showSampleList.js"

export default function loadSampleListFromRemote(state) {
    return new Promise(async (res, rej) => {
        const listURL = staticSettings.getSampleListURL();
        try {
            var response = await fetch(listURL, { mode: 'cors' })
                .catch((e) => { throw Error(e) })
                .then(r => r.json())
            state.localStorage.put("list_of_sample", JSON.stringify(response["list_of_sample"]))
        } catch (e) {
            var stored_list = state.localStorage.get("list_of_sample")
            var response = { "list_of_sample": JSON.parse(stored_list) }
            console.warn(e)
            showErrorMessage("<p>Internet disconnected.</p>")()
        }
        showSampleList(state, response).then(res)
    })
}
