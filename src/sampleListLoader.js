import sampleListPresenter from "./sampleListPresenter.js"
import { staticSettings } from "./global_objects.js"
import { showErrorMessage } from "./error_indicator_handler.js"

export default function sampleListLoader(state) {
    return new Promise(async (res, rej) => {
        const listURL = staticSettings.getSampleListURL();
        try {
            var response = await fetch(listURL)
                .catch((e) => { throw Error(e) })
                .then(r => r.json())
            state.localStorage.put("list_of_sample", JSON.stringify(response["list_of_sample"]))
        } catch (e) {
            var stored_list = state.localStorage.get("list_of_sample")
            var response = { "list_of_sample": JSON.parse(stored_list) }
            console.warn(e)
            showErrorMessage("<p>Internet disconnected.</p>")()
        }

        sampleListPresenter(state)(response)
            .then(_ => res(state))
            .catch(rej)
    })
}
