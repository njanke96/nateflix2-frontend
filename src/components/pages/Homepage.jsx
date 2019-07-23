import React from "react"
import BasePage from "./BasePage"
import { observer } from "mobx-react"
import requests from "../../requests"

@observer
export default class Homepage extends BasePage {
    constructor(props) {
        super(props)
        this.state.showCompleteRegistrationModal = false
    }

    componentDidMount() {
        super.componentDidMount()
        this.checkCompletedRegistration()
    }

    checkCompletedRegistration(retryCount = 0) {
        /*
        Waits until a login username is available (expected to be after the token is checked)
        retries 3 times.
        */
        if (retryCount > 3) return

        // already prompted to complete reg (this session)
        if (this.props.store.completeRegistrationPrompted) return
        
        if (!this.props.store.tokenVerified) {
            // retry
            let retries = retryCount + 1
            setTimeout(() => {
                this.checkCompletedRegistration(retries)
            }, 1000)
            return
        }

        requests.getCompletedRegistration(this.props.store).then(result => {
            if (!this.mounted) return
            if (result === null) {
                console.error("Failed to check if registration completed.")
                return
            }

            this.props.store.setCompleteRegistrationPrompted(true)
            if (!result) {
                this.setState({ showCompleteRegistrationModal: true })
            }
        })
    }

    completeRegistrationModalClosed(success) {
        // success is passed by the modal component to the onClosed prop.
        this.setState({showCompleteRegistrationModal: false})

        if (success) {
            this.props.store.addFlashMessage("Your registration has been completed.")
        }
    }

    pageRender() {
        return (
            <div className="is-clipped">
                {
                    this.state.showCompleteRegistrationModal &&
                    <CompleteRegistrationModal
                        store={this.props.store}
                        username={this.props.store.loginUsername}
                        onClose={this.completeRegistrationModalClosed.bind(this)}
                    />
                }
                <p>Homepage will go here.</p>
            </div>
        )
    }
}

class CompleteRegistrationModal extends React.Component {
    mounted = true

    constructor(props) {
        super(props)
        this.state = {
            submitLoading: false,
            email: "",
            password1: "",
            password2: "",
            failed: false,
            failMessage: ""
        }
    }

    componentWillUnmount() {
        this.mounted = false
    }

    laterClicked() {
        this.props.onClose(false)
    }

    submitClicked() {
        this.setState({
            failed: false,
            failMessage: ""
        })

        // email validity check
        const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        if (!emailRegex.test(String(this.state.email).toLowerCase())) {
            this.setState({
                failed: true,
                failMessage: "Please enter a valid email address."
            })
            return
        }

        // password input check
        if (this.state.password1.length < 1) {
            this.setState({
                failed: true,
                failMessage: "Please enter a password."
            })
            return
        }

        // password match check
        if (this.state.password1 !== this.state.password2) {
            this.setState({
                failed: true,
                failMessage: "The passwords do not match."
            })
            return
        }

        this.setState({submitLoading: true})
        requests.completeRegistration(
            this.props.store, 
            this.state.email, 
            this.state.password1
        ).then(success => {
            if (!this.mounted) return
            this.setState({ submitLoading: false })

            if (!success) {
                this.setState({
                    failed: true,
                    failMessage: "Your registration could not be completed."
                })
                return
            }

            this.props.onClose(true)
        })
    }

    render() {
        let submitClass = "button is-primary"
        if (this.state.submitLoading) {
            submitClass += " is-loading"
        }

        return (
            <div className="modal is-active">
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Complete your registration</p>
                    </header>
                    <section className="modal-card-body">
                        <div className="columns">
                            <div className="column is-6">
                                <div className="form">
                                    <div className="field">
                                        <label className="label">Username</label>
                                        <div className="control">
                                            <input
                                                type="text"
                                                className="input"
                                                value={this.props.username}
                                                disabled
                                            />
                                        </div>
                                    </div>
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
                                    <div className="field">
                                        <label className="label">Password</label>
                                        <div className="control">
                                            <input
                                                className="input"
                                                type="password"
                                                onChange={ev => this.setState({ password1: ev.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Confirm Password</label>
                                        <div className="control">
                                            <input
                                                className="input"
                                                type="password"
                                                onChange={ev => this.setState({ password2: ev.target.value })}
                                            />
                                        </div>
                                    </div>
                                    {
                                        this.state.failed &&
                                        <p className="red">{this.state.failMessage}</p>
                                    }
                                </div>

                            </div>
                            <div className="column is-6">
                                <p>
                                    Please complete your registration so that you can log in with
                                    your own password. Your email is needed in case you forget your
                                    password. Your email will not be given out, I promise.
                            </p>
                            </div>
                        </div>
                        
                    </section>
                    <footer className="modal-card-foot">
                        <button className={submitClass} onClick={this.submitClicked.bind(this)}>Submit</button>
                        <button className="button" onClick={this.laterClicked.bind(this)}>Later</button>
                    </footer>
                </div>
            </div>
        )
    }
}