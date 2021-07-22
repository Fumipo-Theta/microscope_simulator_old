import { RootState } from "@src/js/type/entity"

export default function register(state: RootState, isNewData) {
    if (isNewData) {
        return entry => new Promise((res, rej) => {
            registerZip(state)(entry)
                .then(res)
        })
    } else {
        return _ => new Promise((res, rej) => {
            res(state)
        })
    }
}

function registerZip(state: RootState) {
    return async (entry) => {
        const { cacheStorage: { handler, repo } } = state
        const _newOne = await handler.put(repo, entry)

        state.uiState.storedKeys.push(entry.id)

        if (state.uiState.storedKeys.length > 20) {
            const oldest = state.uiState.storedKeys.shift()
            const _deleted = await handler.delete(repo, oldest)
            Array.from(document.querySelectorAll(`#rock_selector>option[value=${oldest}]`)).forEach(option => {
                const label = option.innerHTML.replace("✓ ", "")
                option.innerHTML = label
                option.classList.remove("downloaded")
            })
        }

        return state
    }
}