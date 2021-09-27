import { atom } from "recoil";
import { Scale } from "@src/js/type/entity";

export const scaleState = atom<Scale>({
    key: 'scaleState',
    default: {
        label: null,
        pixel: null,
        imageRadius: null,
        viewerSize: null,
    }
})
