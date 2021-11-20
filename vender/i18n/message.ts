import { INavigationMessage, IWelcomeMessage, IViewerContainerMessage, ISampleListMessage } from "@src/js/type/message"

export const navigationMessage: INavigationMessage = {
    showSampleList: { ja: "観察するものを選ぶ", en: "Select a sample" },
    hideSampleList: { ja: ">>    閉じる    <<", en: ">>   Close   <<" },
}

export const welcomeMessage: IWelcomeMessage = {
    appDescription: { ja: "偏光顕微鏡観察シミュレーター", en: "Polarizing microscope simulator" },
    recommendUseModernBrowser: { ja: "このアプリはお使いのWebブラウザに対応していません", en: "Sorry, please use web browser below..." },
    recommendLatestBrowserVersion: { ja: "下記のいずれかのブラウザをお使いください (最新版をおすすめします)", en: "I recommend the latest version of them." }
}

export const viewerContainerMessage: IViewerContainerMessage = {

}

export const sampleListMessage: ISampleListMessage = {
    shownCategory: { ja: "表示中", en: "Shown" },
    promptSelectingSubCategory: { ja: "絞り込む", en: "Filter by" }
}
