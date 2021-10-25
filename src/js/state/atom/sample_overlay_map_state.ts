import { SampleOverlayMap } from "@src/js/type/sample_overlay";
import { atom, selector } from "recoil";
import { staticSettings } from "@src/js/config/config";
import { sampleLayersState } from "./sample_layers_state";
import { SampleLayerKey, SampleLayers, SampleOverlayPath } from "@src/js/type/sample_overlay";
import { selectedSampleListItemState } from "./selected_sample_list_item_state";
import { SampleListItemKeys } from "@src/js/type/sample";
import { PackageId } from "@src/js/type/entity";

const sampleOverlayMapSelector = selector<SampleOverlayMap>({
    key: 'sampleOverlayMapSelector',
    get: async ({ get }) => {
        const packageId = get(selectedSampleListItemState)?.[SampleListItemKeys.PackageName]
        if (!packageId) return null

        const layers = get(sampleLayersState)
        if (!layers) return null

        const paths = getOverlayPaths(packageId, layers)
        const kv = await Promise.all(paths.map(async ([path, url]) => [path, await fetchAsDataURL(url)]))
        return Object.fromEntries(kv)
    }
})

export const sampleOverLayMapState = atom<SampleOverlayMap>({
    key: 'sampleOverLayMap',
    default: sampleOverlayMapSelector
})

function getOverlayPaths(packageId: PackageId, layers: SampleLayers): Array<[SampleOverlayPath, string]> {
    try {
        const packageRoot = staticSettings.getImageDataPath(packageId)
        return layers[SampleLayerKey.Layers]
            .flatMap(layer => layer[SampleLayerKey.Overlays]?.map(overlay => overlay[SampleLayerKey.OverlayImageSource]) || [])
            .map(relPath => [relPath, packageRoot + relPath])
    } catch {
        console.error("Failed to parse layers.json")
        return []
    }
}

async function fetchAsDataURL(url) {
    return await fetch(url).then(res => res.blob()).then(blob => URL.createObjectURL(blob))
}