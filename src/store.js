import {observable} from "mobx"

export default class AppStore {
    /*
    elements can be {message, [is]}
    where message is the message, 'is' is the bulma class to
    colour the notification, without the 'is-' examples: 'warning', 'danger'
    */
    @observable flashMessages = []

    addFlashMessage(message, bulmaIs) {
        this.flashMessages.push({
            message,
            is: bulmaIs
        })
    }

    clearFlashMessages() {
        this.flashMessages = []
    }

    removeFlashMessageAtIndex(index) {
        this.flashMessages.splice(index, 1)
    }
}