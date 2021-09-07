import { atom } from "recoil";
import { SampleListItemName } from "@src/js/type/sample";

export const selectedSampleNameState = atom<SampleListItemName>({
    key: 'selectedListItemNameState',
    default: null
})