import React from 'react'
import {autorun} from "mobx"

const PUBLIC_PAGES = [
    "/login",
    "/forgot-password"
]

/* Base component for pages with common functionality */
export default class BasePage extends React.Component {
    mounted = false

    // dispose the redirect autorun when the component will unmount
    redirectDisposer = null

    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }

        this.redirectDisposer = autorun(() => {
            if (this.props.store.redirectTo) {
                const redirectTo = this.props.store.redirectTo
                this.props.store.setRedirectTo(null)
                this.props.history.push(redirectTo)
            }
        })
    }

    componentDidMount() {
        this.mounted = true

        if (!PUBLIC_PAGES.includes(this.props.location.pathname)) {
            if (!this.props.store.loggedIn) {
                // private page being accessed while logged out
                this.props.store.addFlashMessage("You must be logged in to access that page", "warning")
                this.props.store.setRedirectTo("/login")
            }
        }
    }

    componentWillUnmount() {
        this.mounted = false
        this.redirectDisposer()
    }

    /* Set a full page loading state, function is just a shorthand */
    setLoadingState(loading) {
        this.setState(() => {
            return {loading}
        })
    }

    flashDeleted(index) {
        this.props.store.removeFlashMessageAtIndex(index)
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="is-centered">
                    <i class="fa fa-spin fa-2x fa-circle-o-notch" aria-hidden="true"></i>
                </div>
            )
        }

        const messages = []

        if (this.props.store.flashMessages.length > 0) {
            const fm = this.props.store.flashMessages
            for (let i = 0; i < fm.length; i++) {
                const msg = fm[i].message
                const is = (fm[i].is || undefined)
                messages.push(
                    <MessageFlash
                        key={i}
                        index={i}
                        onDeleted={this.flashDeleted.bind(this)}
                        message={msg}
                        is={is}
                    />
                )
            }
        }
        
        /* 
        pageRender is implemented in subclasses instead of render
        */
        return (
            <div>
                {messages}
                {this.pageRender()}
            </div>
        )
    }
}

class MessageFlash extends React.Component {
    constructor(props) {
        super(props)
        this.deleteClicked = this.deleteClicked.bind(this)
    }

    deleteClicked(e) {
        this.props.onDeleted(this.props.index)
    }

    render() {
        let divClass = "notification"
        if (!this.props.message) return
        divClass = divClass + " " + ("is-" + this.props.is) || ""

        return (
            <div className={divClass}>
                <button className="delete" onClick={this.deleteClicked}></button>
                {this.props.message}
            </div>
        )
    }
}