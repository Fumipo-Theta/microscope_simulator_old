import { progressLoading, completeLoading } from "./progress_bar_handlers.js"

export default function unzipper(url) {
    return new Promise((res, rej) => {

        Zip.inflate_file(url, res, rej, progressLoading("#progress_bar"), completeLoading("#progress_bar"))
    })
}
