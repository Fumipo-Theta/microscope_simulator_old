import ISmallStorageFactory from "./ISmallStorageFactory.js"

export default function connectLocalStorage(state) {
    state.localStorage = ISmallStorageFactory();
    return state
}
