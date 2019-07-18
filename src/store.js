import {observable, action, autorun, computed} from "mobx"

export default class AppStore {
    /*
    elements can be {message, [is]}
    where message is the message, 'is' is the bulma class to
    colour the notification, without the 'is-' examples: 'warning', 'danger'
    */
    @observable flashMessages = []
    @observable loginToken = null

    // if this is a string, BasePage will redirect to it.
    @observable redirectTo = null
    
    constructor() {
        // load a login token from storage
        const token = localStorage.getItem("login_token")
        if (token) {
            this.loginToken = token
        }

        // update the localstorage login token when we update our login token
        autorun(() => {
            if (!this.loginToken) {
                localStorage.removeItem("login_token")
                return
            }
            localStorage.setItem("login_token", this.loginToken)
        })
    }

    @action
    addFlashMessage(message, bulmaIs) {
        this.flashMessages.push({
            message,
            is: bulmaIs
        })
    }

    @action
    clearFlashMessages() {
        this.flashMessages = []
    }

    @action
    removeFlashMessageAtIndex(index) {
        this.flashMessages.splice(index, 1)
    }

    @action
    setLoginToken(value) {
        this.loginToken = value
    }

    @computed
    get loggedIn() {
        if (this.loginToken) return true
        return false
    }

    @action
    setRedirectTo(path) {
        this.redirectTo = path
    }
}