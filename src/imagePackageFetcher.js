import unzipper from "./unzipper.js"
import extractFile from "./extractFile.js"

export default function imagePackageFetcher(packageUrl) {
    return async () => await unzipper(packageUrl)
        .then(extractFile)
}
