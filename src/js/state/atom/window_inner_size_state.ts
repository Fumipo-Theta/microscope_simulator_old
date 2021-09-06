import { atom } from "recoil";
import { RectSize } from "@src/js/type/entity";

export const windowInnerSizeState = atom<RectSize>({
    key: 'windowInnerSize',
    default: { width: 0, height: 0 }
})