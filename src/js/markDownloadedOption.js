/**
 *
 * @param {*} packageName
 * @return {Object[meta,zip]}
 */
export default function markDownloadedOption(packageName) {
    return manifest => _ => new Promise((res, rej) => {
        Array.from(document.querySelectorAll(`#rock_selector>option[value=${packageName}]`)).forEach(option => {
            const label = option.innerHTML.replace("✓ ", "")
            option.innerHTML = "✓ " + label
            option.classList.add("downloaded")
        })
        res(_)
    })
}
