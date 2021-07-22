import { RootState } from "@src/js/type/entity"
import { handler } from "script/in_cloud/lambda/onetime_payment_function"

export default async function getStoredDBEntryKeys(state: RootState) {
    const { handler, repo } = state.cacheStorage
    state.uiState.storedKeys = await handler.getAllKeys(repo)
    return state
}
