import React from "react"
import BasePage from "./BasePage"
import { observer } from "mobx-react"
import requests from "../../requests"

@observer
export default class PasswordRecover extends BasePage {
    constructor(props) {
        super(props)
        this.state.title = "Recover Nateflix Password"
        this.state.email = ""
        this.state.failed = false
        this.state.submitting = false
    }

    submitClicked() {
        this.setState({failed: false, submitting: true})

        // build url of reset page
        const url = window.location.protocol + 
            "//" + window.location.hostname + "/reset-password"

        requests.recoverPassword(this.props.store, this.state.email, url).then(result => {
            if (!this.mounted) return
            this.setState({submitting: false})

            if (!result) {
                this.setState({failed: true})
                return
            }

            // successful
            this.props.store.addFlashMessage("A link to reset your password has been e-mailed to you.")
            this.props.history.replace("/login")
        })
    }

    pageRender() {
        let btnClass = "button is-primary"
        if (this.state.submitting) {
            btnClass += " is-loading"
        }

        return (
            <div>
                <h1 className="title">Password Recovery</h1>
                <p>
                    Enter the e-mail address associated with your account, and your username will
                    be sent to your inbox, along with a link to change your password.
                </p>
                <p className="splitter"></p>
                <div className="columns">
                    <div className="column is-4">
                        <div className="field">
                            <label className="label">E-mail</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    className="input" 
                                    onChange={ev => this.setState({ email: ev.target.value })}
                                />
                            </div>
                        </div>
                        <div className="field is-grouped">
                            <p className="control pushed-control">
                                <button className={btnClass} onClick={this.submitClicked.bind(this)}>Submit</button>
                            </p>
                        </div>
                        {
                            this.state.failed &&
                            <p className="red">There is no account associated with that email.</p>
                        }
                    </div>
                </div>
            </div>
        )
    }
}