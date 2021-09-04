import { progressLoading, completeLoading } from "./progress_bar_handlers.js"
import { Zip } from "@src/js/zip"

export default function unzipper(url) {
    return new Promise((res, rej) => {
        Zip.inflate_file(url, res, rej, () => { }, () => { })
    })
}
