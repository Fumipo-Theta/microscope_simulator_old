import * as React from "react"
import { useState } from "react"
import sendContactMessage from "./sendContactMessage.js"
import styles from "./index.module.css"

type ContactFormProps = {}

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

export const ContactFormCard: React.FC<ContactFormProps> = (_props) => {
    const [readyToSubmit, updateReadyToSubmit] = useState(false)

    return (
        <>
            <style>{style}</style>
            <div className={styles.formWrapper}>
                <p><span className="important">Please give your feedback !</span></p>
                <form id="form-contact" className="spread">
                    <div className="spread space-around">

                        <select id="select-contact_topic" defaultValue="dummy">
                            <option value='dummy' disabled style={{ display: "none" }}>Select topic</option>
                            <option value="error">Error & Bags</option>
                            <option value="question">Question</option>
                            <option value="request">Request</option>
                            <option value="others">Others</option>
                        </select>
                    </div>
                    <div className="spread space-around column-direction">
                        <textarea id="contact-body" className="spread" rows={8} placeholder="Enter message..."></textarea>
                    </div>

                    <div className="spread space-around">
                        <div>Email (optional)</div>
                        <input type="email" placeholder="your.email@example.com" />
                    </div>

                    <p className="form-message inactive">Form message</p>
                    <div className={styles.submitButton} onClick={sendContactMessage}>Submit</div>
                </form>
            </div>
        </>
    )
}