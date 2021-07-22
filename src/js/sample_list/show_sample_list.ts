/**
 * サンプルリストをselectタグ内に追加する
 */
export default async function showSampleList(sampleList, lang, cachedList = []): Promise<void> { // this function should take state as arg
    const sampleSelectDOM = document.querySelector("#rock_selector");
    sampleSelectDOM.innerHTML = "<option value='' disabled selected style='display:none;'>Select sample</option>";
    const options = sampleList.map((v, i) => {
        const option = document.createElement("option")
        option.value = v["package-name"];
        option.innerHTML = (cachedList.includes(v["package-name"]) ? "✓ " : "") + `${i + 1}. ${v["list-name"][lang]}`
        if (cachedList.includes(v["package-name"])) {
            option.classList.add("downloaded")
        }
        return option
    })
    options.forEach(v => {
        sampleSelectDOM.appendChild(v)
    })

    document.querySelector("#top-navigation").classList.add("isready");
    sampleSelectDOM.classList.add("isready")
    return null
}
