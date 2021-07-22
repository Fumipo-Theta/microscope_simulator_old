import { RootState } from "@src/js/type/entity"
import { staticSettings } from "./config/config"
import DatabaseHandler from "./DatabaseHandler"
import DummyDatabaseHandler from "./DummyDatabaseHandler"

export default async function connectCacheDatabase(state: RootState): Promise<RootState> {
    state.cacheStorage.handler = (window.indexedDB)
        ? (!navigator.userAgent.match("Edge"))
            ? new DatabaseHandler(staticSettings.getDBName(), 2, staticSettings.getStorageName(), "id")
            : new DatabaseHandler(staticSettings.getDBName(), 1, staticSettings.getStorageName(), "id")
        : new DummyDatabaseHandler(staticSettings.getDBName(), 2, staticSettings.getStorageName(), "id")
    state.cacheStorage.repo = await state.cacheStorage.handler.connect()
    return state
};
