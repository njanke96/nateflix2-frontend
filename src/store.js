import {observable, action, autorun, computed} from "mobx"
import {sha256} from "js-sha256"
import requests from "./requests"

export default class AppStore {
    /*
    elements can be {message, [is]}
    where message is the message, 'is' is the bulma class to
    colour the notification, without the 'is-' examples: 'warning', 'danger'
    */
    @observable flashMessages = []
    @observable loginToken = null
    @observable loginUsername = ""
    @observable userHasAdmin = false

    // if this is a string, BasePage will redirect to it.
    @observable redirectTo = null
    
    constructor() {
        // load a login token from storage
        const token = localStorage.getItem("login_token")
        if (token) {
            this.loginToken = token
        }

        this._checkToken()

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
        const date = new Date()
        this.flashMessages.push({
            message,
            is: bulmaIs,

            // unique id is hash of message plus current time
            id: sha256(message + date.getTime())
        })
    }

    @action
    clearFlashMessages() {
        this.flashMessages = []
    }

    @action
    removeFlashMessage(id) {
        for (let i = 0; i < this.flashMessages.length; i++) {
            let fm = this.flashMessages[i]
            if (fm.id === id) this.flashMessages.splice(i, 1)
        }
    }

    @action
    setLoginToken(value) {
        this.loginToken = value
        this._checkToken()
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

    /* Update the login details */
    _checkToken() {
        if (this.loginToken === null) {
            this.loginUsername = ""
            this.userHasAdmin = false
        } else {
            requests.checkToken(this).then(response => {
                this.loginUsername = response.username
                this.userHasAdmin = response.userHasAdmin
            })
        }
    }
}