/**
 *
 * @param {*} state
 * @param {*} key
 * @return {Object[meta,zip]}
 */
export default function registerZip(state) {
    return async (entry) => {

        const _newOne = await state.zipDBHandler.put(state.zipDB, entry)

        state.uiState.storedKeys.push(entry.id)

        if (state.uiState.storedKeys.length > 20) {
            const oldest = state.uiState.storedKeys.shift()
            const _deleted = await state.zipDBHandler.delete(state.zipDB, oldest)
            Array.from(document.querySelectorAll(`#rock_selector>option[value=${oldest}]`)).forEach(option => {
                const label = option.innerHTML.replace("✓ ", "")
                option.innerHTML = label
                option.classList.remove("downloaded")
            })
        }

        return state
    }
}
