import { atom } from "recoil";
import { WithMode } from "@src/js/type/sample_overlay";

export const AnnotationContentState = atom<WithMode<string>>({
    key: "annotationContent",
    default: null
})

export const AnnotationActiveKeyState = atom<string>({
    key: "annotationActiveKey",
    default: null
})