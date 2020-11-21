import { staticSettings } from "./config.js"
import DatabaseHandler from "./DatabaseHandler.js"
import DummyDatabaseHandler from "./DummyDatabaseHandler.js"

export default async function connectDatabase(state) {
    state.zipDBHandler = (window.indexedDB)
        ? (!navigator.userAgent.match("Edge"))
            ? new DatabaseHandler(staticSettings.getDBName(), 2, staticSettings.getStorageName(), "id")
            : new DatabaseHandler(staticSettings.getDBName(), 1, staticSettings.getStorageName(), "id")
        : new DummyDatabaseHandler(staticSettings.getDBName(), 2, staticSettings.getStorageName(), "id")
    state.zipDB = await state.zipDBHandler.connect()
    return state
};
