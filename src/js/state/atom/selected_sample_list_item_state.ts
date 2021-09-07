import { atom } from "recoil";
import { SampleListItem } from "@src/js/type/sample";

export const selectedSampleListItemState = atom<SampleListItem>({
    key: 'selectedSampleId',
    default: null
})
