import { atom } from "recoil";


export const sampleListNameState = atom<string>({
    key: 'sampleListName',
    default: ''
})
