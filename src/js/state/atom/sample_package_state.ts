import { atom, selector } from "recoil"
import { SamplePackage } from "@src/js/type/entity"
import { retrieve } from "@src/js/remote_repo/static/package_repo"
import { selectedSampleIdState } from "./selected_sample_id_state"
import { supportedImageTypeState } from "./supported_image_type_state"

export const samplePackageSelector = selector<SamplePackage>({
    key: 'samplePackageSelector',
    get: async ({ get }) => {
        const currentSampleId = get(selectedSampleIdState)
        console.log("selector", currentSampleId)
        if (currentSampleId != '') {
            const imageType = get(supportedImageTypeState)
            console.log("selector image-type", imageType)
            try {
                const currentSample = await retrieve(currentSampleId, imageType)
                return { ...currentSample, manifest: JSON.parse(currentSample.manifest) }
            } catch {
                return null
            }

        } else {
            return null
        }
    }
})

export const samplePackageState = atom<SamplePackage>({
    key: 'samplePackage',
    default: samplePackageSelector
})



