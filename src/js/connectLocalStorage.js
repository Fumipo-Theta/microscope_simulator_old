import ISmallStorageFactory from "./ISmallStorageFactory.js"

// connectLocalStorage = ISmallStorage -> state -> state にする?
export default function connectLocalStorage(state) {
    state.localStorage = ISmallStorageFactory();
    return state
}
