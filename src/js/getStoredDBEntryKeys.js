export default async function getStoredDBEntryKeys(state) {
    state.uiState.storedKeys = await state.zipDBHandler.getAllKeys(state.zipDB)
    return state
}
