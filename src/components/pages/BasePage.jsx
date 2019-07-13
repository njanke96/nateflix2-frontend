import React from 'react'

/* Base component for pages with common functionality */
export default class BasePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,

            /* 
            can be {message, [is]}
            where message is the message, 'is' is the bulma class to
            colour the notification, without the 'is-' examples: 'warning', 'danger'
            */
            flashMessage: null
        }

        // bind event callbacks
        this.flashDeleted = this.flashDeleted.bind(this)
    }

    /* Set a full page loading state, function is just a shorthand */
    setLoadingState(loading) {
        this.setState(() => {
            return {loading}
        })
    }

    componentDidMount() {
        // todo: check login token, if it is missing or invalid, 
        // and we are not in public area, redirect to login with a message flash

        // todo: check for message flash in localstorage and set state, use an expiry key

        // todo: fuck it use redux for all this
    }

    flashDeleted() {
        // nullify flashMessage
        this.setState({flashMessage: null})
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="is-centered">
                    <i class="fa fa-spin fa-2x fa-circle-o-notch" aria-hidden="true"></i>
                </div>
            )
        }

        if (this.state.flashMessage !== null) {
            const msg = this.state.flashMessage.message
            const is = (this.state.flashMessage.is || null)
            let message = null
            if (is !== null) {
                message = <MessageFlash onDeleted={this.flashDeleted} message={msg} is={is} />
            } else {
                message = <MessageFlash onDeleted={this.flashDeleted} message={msg} />
            }

            return (
                <div>
                    {message}
                    {this.pageRender()}
                </div>
            )
        }
        
        /* 
        pageRender is implemented in subclasses instead of render
        */
        return this.pageRender()
    }
}

class MessageFlash extends React.Component {
    constructor(props) {
        super(props)
        this.deleteClicked = this.deleteClicked.bind(this)
    }

    deleteClicked(e) {
        this.props.onDeleted()
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