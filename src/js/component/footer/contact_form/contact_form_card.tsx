import * as React from "react"
import { useState } from "react"
import sendContactMessage from "./sendContactMessage.js"

type ContactFormProps = {}

export const ContactFormCard: React.FC<ContactFormProps> = (_props) => {
    const [readyToSubmit, updateReadyToSubmit] = useState(false)

    return (
        <div className="form-wrapper space-around column-direction">
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
                <div className="button rect-button space-around" onClick={sendContactMessage}>Submit</div>
            </form>
        </div>
    )
}