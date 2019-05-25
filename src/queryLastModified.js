/**
 *
 * @param {String} url
 * @return {Array[String, Boolean]} [lastModified, networkDisconnected]
 */
export default async function queryLastModified(url) {
    try {
        const header = await fetch(url, { method: 'HEAD' }).catch(e => {
            console.log("Package metadata cannot be fetched.")
            throw Error(e)
        })
        var lastModified = header.headers.get("last-modified")
        var networkDisconnected = false
        return [lastModified, networkDisconnected]
    } catch (e) {
        var lastModified = "none"
        var networkDisconnected = true
        return [lastModified, networkDisconnected]
    }
}
