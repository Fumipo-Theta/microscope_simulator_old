import { atom } from "recoil"

export const sampleListAppearanceState = atom<boolean>({
    key: 'sampleListAppearance',
    default: false
})