import sendContactMessage from "./sendContactMessage.js"

export default function setContactFormEventHandlers(state) {
    document.querySelector("#form-contact div.button").addEventListener(
        "click",
        e => (Array.from(e.target.classList).includes("pending"))
            ? null
            : sendContactMessage(
                e,
                document.querySelector("#form-contact .form-message")
            ),
        false
    )
}
