import MessageBarActivitySwitcher from "./MessageBarActivitySwitcher.js"

const switchErrorMessage = new MessageBarActivitySwitcher(
    "#error_message_bar"
).setHookOnInactivate(
    rootNode => {
        rootNode.classList.remove("message-error")
    }
)

export function hideErrorMessage(state) {
    switchErrorMessage.inactivate()
    return state
}

export function showErrorMessage(message) {
    return (_) => {
        switchErrorMessage.setHookOnActivate(
            rootDOM => {
                rootDOM.querySelector(".message_space").innerHTML = message
                rootDOM.classList.add("message-error")
            }
        )
        switchErrorMessage.activate()
        return _
    }
}
