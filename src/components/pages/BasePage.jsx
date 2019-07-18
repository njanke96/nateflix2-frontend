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

    flashDeleted(id) {
        this.props.store.removeFlashMessage(id)
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
                const id = (fm[i].id)
                messages.push(
                    <MessageFlash
                        key={i}
                        id={id}
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
    intervalId = 0
    lifetime = 0

    constructor(props) {
        super(props)
        this.deleteClicked = this.deleteClicked.bind(this)
        this.state = {
            opacity: 100
        }
    }

    componentDidMount() {
        // lifetime counter with fade effect
        this.lifetime = 0
        const interval = 100
        this.intervalId = setInterval(() => {
            this.lifetime += interval
        }, interval)
    }

    componentWillUnmount() {
        clearInterval(this.intervalId)
        if (this.lifetime >= 2000) {
            // assume the user saw it after 2 seconds
            this.props.onDeleted(this.props.id)
        }
    }

    deleteClicked(e) {
        this.props.onDeleted(this.props.id)
    }

    render() {
        let divClass = "notification"
        if (!this.props.message) return
        divClass = divClass + " " + ("is-" + this.props.is) || ""

        let divStyle = {
            opacity: this.state.opacity
        }

        return (
            <div className={divClass} style={divStyle}>
                <button className="delete" onClick={this.deleteClicked}></button>
                {this.props.message}
            </div>
        )
    }
}