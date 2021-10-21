import { atom } from "recoil";
import { I18nMap } from "@src/js/type/entity";
import { WithMode } from "@src/js/type/sample_overlay";

export const AnnotationContentState = atom<WithMode<I18nMap<string>>>({
    key: "annotationContent",
    default: null
})

export const AnnotationActiveKeyState = atom<string>({
    key: "annotationActiveKey",
    default: null
})