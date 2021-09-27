import { I18nMap } from "./entity";

export enum SampleListItemKeys {
    PackageName = "package-name",
    ListName = "list-name",
    Category = "category",
    GlobalIndex = "globalIndex",
}

export type SampleListItemName = I18nMap<string>;

export interface SampleListItem {
    [SampleListItemKeys.PackageName]: string
    [SampleListItemKeys.ListName]: SampleListItemName
    [SampleListItemKeys.Category]: Array<string>
    [SampleListItemKeys.GlobalIndex]: number
}

export enum SampleListKeys {
    ListOfSample = "list_of_sample"
}

export interface SampleList {
    [SampleListKeys.ListOfSample]: Array<SampleListItem>
}

export enum SampleCategoryItemKeys {
    Id = "id",
    Label = "label",
    SubCategories = "subcategories"
}

export interface SampleCategoryItem {
    [SampleCategoryItemKeys.Id]: string
    [SampleCategoryItemKeys.Label]: I18nMap<string>
    [SampleCategoryItemKeys.SubCategories]?: Array<SampleCategoryItem>
}

export enum SampleCategoriesKeys {
    Categories = "categories"
}

export interface SampleCategories {
    [SampleCategoriesKeys.Categories]: Array<SampleCategoryItem>
}

export const ROOT_CATEGORY_ID = "ROOT_CATEGORY_ID"
