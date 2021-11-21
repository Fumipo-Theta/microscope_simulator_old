import { I18nMessages, I18nMap } from "./entity";

export interface INavigationMessage {
    showSampleList: I18nMap<string>,
    hideSampleList: I18nMap<string>,
}

export interface IWelcomeMessage {
    appDescription: I18nMap<string>,
    recommendUseModernBrowser: I18nMap<string>,
    recommendLatestBrowserVersion: I18nMap<string>,
}

export interface IViewerContainerMessage {

}

export interface ISampleListMessage {
    shownCategory: I18nMap<string>,
    promptSelectingSubCategory: I18nMap<string>,
    noSubcategory: I18nMap<string>,
}
