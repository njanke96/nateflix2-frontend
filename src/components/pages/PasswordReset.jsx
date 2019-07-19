import React from "react"
import BasePage from "./BasePage"
import { observer } from "mobx-react"
import requests from "../../requests"
import { isNull } from "util";

@observer
export default class PasswordReset extends BasePage {
    constructor(props) {
        super(props)
        this.state.title = "Reset Nateflix Password"
        this.state.submitting = false
        this.state.failed = false
        this.state.failMessage = ""
        this.state.password1 = ""
        this.state.password2 = ""
    }
    submitClicked() {
        this.setState({failed: false, failMessage: ""})
        
        if (this.state.password1 !== this.state.password2) {
            this.setState({failed: true, failMessage: "The passwords do not match."})
            return
        }

        const resetToken = new URLSearchParams(this.props.location.search).get("resettoken")
        if (resetToken === null) {
            this.setState({failed: true, failMessage: "Missing reset token."})
        }

        this.setState({submitting: true})
        requests.resetPassword(this.props.store, resetToken, this.state.password1).then(result => {
            if (!this.mounted) return
            this.setState({submitting: false})

            if (!result) {
                this.setState({
                    failed: true, 
                    failMessage: "Password reset failed. The reset token may have expired."
                })
                return
            }

            // successful
            this.props.store.addFlashMessage(
                "Your password has been reset, you may now log in " + 
                "with your new password"
            )
            this.props.history.replace("/login")
        })
    }
    
    pageRender () {
        return (
            <div>
                <h1 className="title">Password Reset</h1>
                <div className="columns">
                    <div className="column is-4">
                        <div className="field">
                            <label className="label">New Password</label>
                            <div className="control">
                                <input 
                                    type="password" 
                                    className="input"
                                    onChange={ev => this.setState({ password1: ev.target.value })}
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Confirm Password</label>
                            <div className="control">
                                <input 
                                    type="password" 
                                    className="input" 
                                    onChange={ev => this.setState({ password2: ev.target.value })}
                                />
                            </div>

                        </div>
                        <div className="field is-grouped">
                            <p className="control pushed-control">
                                <button className="button is-primary" onClick={this.submitClicked.bind(this)}>Submit</button>
                            </p>
                        </div>
                        {
                            this.state.failed &&
                            <p className="red">{this.state.failMessage}</p>
                        }
                    </div>
                </div>
            </div>
        )
    }
}