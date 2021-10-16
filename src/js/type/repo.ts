import { PackageId, SampleImageType, SamplePackageZipped } from "./entity"
import { SampleLayers } from "./sample_overlay"

export type RetrieveSample = (id: PackageId, format: SampleImageType) => Promise<SamplePackageZipped>
export type RetrieveLayers = (id: PackageId) => Promise<SampleLayers>
export type QueryLastModified = (id: PackageId, format: SampleImageType) => Promise<[string, boolean]>
