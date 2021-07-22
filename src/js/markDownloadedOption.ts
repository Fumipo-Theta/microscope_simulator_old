import { Manifest, PackageId } from "@src/js/type/entity"

export default function markDownloadedOption(packageName: PackageId) {
    return (manifest: Manifest) => _ => new Promise((res, rej) => {
        Array.from(document.querySelectorAll(`#rock_selector>option[value=${packageName}]`)).forEach(option => {
            const label = option.innerHTML.replace("✓ ", "")
            option.innerHTML = "✓ " + label
            option.classList.add("downloaded")
        })
        res(_)
    })
}
