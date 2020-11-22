
import NativeLocalStorage from "./NativeLocalStorage";
import DummyLocalStorage from "./DummyLocalStorage";

export default function ISmallStorageFactory() {
    return (window.localStorage)
        ? new NativeLocalStorage()
        : new DummyLocalStorage()
}
