import { atom } from "recoil";
import { PackageId } from "@src/js/type/entity";

export const selectedSampleIdState = atom<PackageId>({
    key: 'selectedSampleId',
    default: ''
})
