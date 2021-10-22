import { atom, selector } from "recoil"
import { retrieveSampleLayersJson } from "@src/js/remote_repo/static/package_repo"
import { SampleListItemKeys } from "@src/js/type/sample"
import { SampleLayers } from "@src/js/type/sample_overlay"

import { selectedSampleListItemState } from "./selected_sample_list_item_state"

export const sampleLayersSelector = selector<SampleLayers>({
    key: 'sampleLayersSelector',
    get: async ({ get }) => {
        const currentSampleListItem = get(selectedSampleListItemState)
        const currentSampleId = currentSampleListItem?.[SampleListItemKeys.PackageName] || ''
        if (currentSampleId != '') {
            try {
                return await retrieveSampleLayersJson(currentSampleId)
            } catch {
                console.log(`[sampleLayersSelector] Failed to fetch sample layer by id: ${currentSampleId}`)
                return null
            }
        } else {
            return null
        }
    }
})

export const sampleLayersState = atom<SampleLayers>({
    key: 'sampleLayers',
    default: sampleLayersSelector
})
