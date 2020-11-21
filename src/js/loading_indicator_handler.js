import MessageBarActivitySwitcher from "./MessageBarActivitySwitcher.js"

const switchLoadingMessage = new MessageBarActivitySwitcher(
    "#loading_message_bar"
).setHookOnActivate(
    rootNode => {
        rootNode.querySelector(".message_space").innerHTML = "Loading images..."
        rootNode.classList.add("message-loading")
    }
).setHookOnInactivate(
    rootNode => {
        rootNode.classList.remove("message-loading")
    }
)

export const showLoadingMessage = state => {
    switchLoadingMessage.activate()
    return state
}

export const hideLoadingMessage = state => {
    switchLoadingMessage.inactivate()
    return state
}
