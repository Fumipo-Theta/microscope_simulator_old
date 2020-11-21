/**
 *
 * @param {*} state
 * @param {*} key
 * @return {Object[meta,zip]}
 */
export default function registerZip(state) {
    return async (entry) => {

        const newOne = await state.zipDBHandler.put(state.zipDB, entry)

        state.storedKeys.push(entry.id)

        if (state.storedKeys.length > 20) {
            const oldest = state.storedKeys.shift()
            const deleted = await state.zipDBHandler.delete(state.zipDB, oldest)
            Array.from(document.querySelectorAll(`#rock_selector>option[value=${oldest}]`)).forEach(option => {
                const label = option.innerHTML.replace("✓ ", "")
                option.innerHTML = label
                option.classList.remove("downloaded")
            })
        }

        return state
    }
}
