import type { IAppDescriptionMessage } from "@vender/component/footer/custom/app_description/app_description"
import type { IContactFormMessage } from "@vender/component/footer/custom/contact_form/contact_form_card"

export const appDescriptionMessage: IAppDescriptionMessage = {
    head1: { ja: "偏光顕微鏡観察シミュレーター SCOPin rock!", en: "Polarization microscope simulator, SCOPin rock!" },
    guideToPackageMaker: { ja: "薄片画像パッケージ作成はこちら (運営向け)", "en": "Create microscope images package" },
    announceCopyRight: {
        ja: "このアプリと全てのコンテンツは Fumipo Theta が制作しています。制作者の許可なくアプリやコンテンツの複製・改変・再配布することを禁じます。",
        en: "This application and all contents are made by Fumipo Theta. Please do not copy, modify, and repost any contents without telling me."
    },
    privacyPolicy: { ja: "プライバシーポリシー", en: "Privacy policy" },
    sourceCodeAvailableAt: { ja: "ソースコード公開場所: ", en: "Source code is available at" },
}

export const contactFormMessage: IContactFormMessage = {
    formTitle: { ja: "お問い合わせや感想はこちらから", en: "Please give your feedback!" },
    topicPlaceholder: { ja: "お問い合わせ内容を選択", en: "Select topic" },
    topicBug: { ja: "不具合・バグ報告", en: "Error & bug" },
    topicQuestion: { ja: "不明点・質問", en: "Question" },
    topicFeatureRequest: { ja: "サービス・機能追加要望", en: "Feature request" },
    topicFeedback: { ja: "感想など", en: "Feedback" },
    topicOthers: { ja: "その他", en: "Other" },
    inputEmail: { ja: "Enail (任意)", en: "Email (optional)" },
    bodyPlaceholder: { ja: "メッセージを入力...", en: "Input message..." },
    submitFeedback: { ja: "送信する", en: "Submit" },
}
