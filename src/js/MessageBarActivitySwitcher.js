export default class MessageBarActivitySwitcher {
    constructor(messageBarSelector) {
        this.root = document.querySelector(messageBarSelector)
        this.hook = {}
        return this
    }

    activate() {
        this.hook["activate"](this.root)
        this.root.classList.remove("inactive")
    }

    inactivate() {
        this.hook["inactivate"](this.root)
        this.root.classList.add("inactive")
    }

    setHookOnActivate(hook = rootNode => { }) {
        this.hook["activate"] = hook
        return this
    }

    setHookOnInactivate(hook = rootNode => { }) {
        this.hook["inactivate"] = hook
        return this
    }
}
