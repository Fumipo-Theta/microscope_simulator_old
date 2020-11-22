import { bufferToBase64 } from "./data_translaters.js"

/**
 *
 * @param {*} zip
 * @return {Object[meta,zip]}
 */
export default async function extractFile(zipByte) {
    const zip = Zip.inflate(zipByte)
    const inflated_zip = {}
    await Promise.all(Object.entries(zip.files).map(async kv => {
        if (kv[0].includes(".json")) {
            inflated_zip[kv[0]] = kv[1].inflate()
        } else {
            const type = kv[0].match(/.*\.(\w+)$/)[1]
            const base64 = await bufferToBase64(kv[1].inflate(), type)
            const mime = base64.match(/^data:(image\/\w+);/)[1]
            const mime_type = mime.split("/")[1]

            const new_file_name = kv[0].split(".")[0] + "." + mime_type

            inflated_zip[new_file_name] = base64

        }

        return true
    }))

    return inflated_zip
}
