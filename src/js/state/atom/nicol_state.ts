import { atom } from "recoil";

export const isOpenNicolState = atom<boolean>({
    key: 'isOpenNicol',
    default: true
})