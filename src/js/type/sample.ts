import { Language } from "./entity";

export enum SampleListItemKeys {
    PackageName = "package-name",
    ListName = "list-name",
    Category = "category",
}

export interface SampleListItem {
    [SampleListItemKeys.PackageName]: string
    [SampleListItemKeys.ListName]: {
        [key in keyof Language]: string
    }
    [SampleListItemKeys.Category]: Array<string>
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
    [SampleCategoryItemKeys.Label]: {
        [key in keyof Language]: string
    }
    [SampleCategoryItemKeys.SubCategories]?: Array<SampleCategoryItem>
}

export enum SampleCategoriesKeys {
    Categories = "categories"
}

export interface SampleCategories {
    [SampleCategoriesKeys.Categories]: Array<SampleCategoryItem>
}
