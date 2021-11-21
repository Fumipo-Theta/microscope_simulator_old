import * as React from "react"
import sendContactMessage from "./sendContactMessage.js"
import styles from "./index.module.css"
import { I18nMap } from "@src/js/type/entity.js"
import useLang from "@src/js/hooks/use_lang"
import { withFallbackLanguage } from "@src/js/util/language_util"

type ContactFormProps = { message: IContactFormMessage }

const style = `
.important {
    font-size: 1.5em;
}

.spread {
    width: 100%;
    margin: 10px 0;
}

.form-message {
    font-size: 1.2em;
}

.form-message.error {
    color: #fa755a;
}

.form-message.success {
    color: #12dd88;
}

input[type="email"],
input[type="text"] {
    width: 100%;
    font-size: 1.2rem;
}

.inactive {
            display: none;
            animation: fadeOut 0.5s ease forwards;
        }

        .align-center {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .space-around {
            display: flex;
            justify-content: space-around;
            align-items: center;
        }

        .column-direction {
            flex-direction: column;
        }
`

export interface IContactFormMessage {
    formTitle: I18nMap<string>,
    topicPlaceholder: I18nMap<string>,
    topicBug: I18nMap<string>,
    topicQuestion: I18nMap<string>,
    topicFeatureRequest: I18nMap<string>,
    topicFeedback: I18nMap<string>,
    topicOthers: I18nMap<string>,
    inputEmail: I18nMap<string>,
    bodyPlaceholder: I18nMap<string>,
    submitFeedback: I18nMap<string>,

}

export const ContactFormCard: React.FC<ContactFormProps> = ({ message }) => {
    const [lang, _] = useLang()

    return (
        <>
            <style>{style}</style>
            <div className={styles.formWrapper}>
                <p><span className="important">{withFallbackLanguage(message.formTitle, lang)
                }</span></p>
                <form id="form-contact" className="spread">
                    <div className="spread space-around">

                        <select id="select-contact_topic" defaultValue="dummy">
                            <option value='dummy' disabled style={{ display: "none" }}>{withFallbackLanguage(message.topicPlaceholder, lang)}</option>
                            <option value="error">{withFallbackLanguage(message.topicBug, lang)}</option>
                            <option value="question">{withFallbackLanguage(message.topicQuestion, lang)}</option>
                            <option value="request">{withFallbackLanguage(message.topicFeatureRequest, lang)}</option>
                            <option value="feedback">{withFallbackLanguage(message.topicFeedback, lang)}</option>
                            <option value="others">{withFallbackLanguage(message.topicOthers, lang)}</option>
                        </select>
                    </div>
                    <div className="spread space-around column-direction">
                        <textarea id="contact-body" className="spread" rows={8} placeholder={withFallbackLanguage(message.bodyPlaceholder, lang)}></textarea>
                    </div>

                    <div className="spread space-around">
                        <div>{withFallbackLanguage(message.inputEmail, lang)}</div>
                        <input type="email" placeholder="your.email@example.com" />
                    </div>

                    <p className="form-message inactive">Form message</p>
                    <div className={styles.submitButton} onClick={sendContactMessage}>{withFallbackLanguage(message.submitFeedback, lang)}</div>
                </form>
            </div>

            <script type="text/javascript" defer src="js/lib/axios/dist/axios.standalone.js"></script>
            <script type="text/javascript" defer src="js/lib/CryptoJS/rollups/hmac-sha256.js"></script>
            <script type="text/javascript" defer src="js/lib/CryptoJS/rollups/sha256.js"></script>
            <script type="text/javascript" defer src="js/lib/CryptoJS/components/hmac.js"></script>
            <script type="text/javascript" defer src="js/lib/CryptoJS/components/enc-base64.js"></script>
            <script type="text/javascript" defer src="js/lib/url-template/url-template.js"></script>
            <script type="text/javascript" defer src="js/lib/apiGatewayCore/sigV4Client.js"></script>
            <script type="text/javascript" defer src="js/lib/apiGatewayCore/apiGatewayClient.js"></script>
            <script type="text/javascript" defer src="js/lib/apiGatewayCore/simpleHttpClient.js"></script>
            <script type="text/javascript" defer src="js/lib/apiGatewayCore/utils.js"></script>
            <script type="text/javascript" defer src="js/lib/apigClient.js"></script>
        </>
    )
}