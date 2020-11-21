export default async function getStoredDBEntryKeys(state) {
    state.storedKeys = await state.zipDBHandler.getAllKeys(state.zipDB)
    return state
}
