/* Login page shown whenever a login is required */
import {Link} from "react-router-dom"
import React from "react"
import {observer} from "mobx-react"

import BasePage from "./BasePage"
import requests from "../../requests"

@observer
export default class Login extends BasePage {
    constructor(props) {
        super(props)
        this.state.username = ""
        this.state.password = ""
        this.state.loginLoading = false
        this.state.loginFail = false
    }

    pageRender() {
        let loginButtonClass = "button is-primary"
        if (this.state.loginLoading) loginButtonClass += " is-loading"

        return (
            <div className="login-page columns">

                <div className="column is-4">
                    <h1 className="title">Login</h1>
                    <div className="field">
                        <label className="label">Username</label>
                        <div className="control">
                            <input 
                                className="input" 
                                type="text" 
                                onChange={ev => this.setState({username: ev.target.value})}
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Password</label>
                        <div className="control">
                            <input 
                                className="input" 
                                type="password" 
                                onChange={ev => this.setState({password: ev.target.value})}
                            />
                        </div>
                    </div>
                    <div className="field is-grouped">
                        <Link to="/forgot-password">Forgot your password?</Link>
                        <p className="control pushed-control">
                            <button className={loginButtonClass} onClick={this.loginClicked.bind(this)}>Login</button>
                        </p>
                    </div>
                    {
                        this.state.loginFail &&
                        <p className="red">Invalid username/password</p>
                    }
                </div>

                <div className="column is-8">
                    <h1 className="subtitle">Problems logging in?</h1>
                    <p>
                        Click the link below the login form to reset your password. You must have 
                        entered your email to do this. If you do not have an account, 
                        you can't create one. This is a private website.
                    </p>
                </div>

            </div>
        )
    }

    loginClicked() {
        this.setState({loginLoading: true, loginFail: false})

        requests.login(this.props.store, this.state.username, this.state.password).then(token => {
            this.setState({ loginLoading: false })

            // failed login
            if (!token) {
                this.setState({loginFail: true})
                return
            }

            // successful login, set token and go home
            this.props.store.setLoginToken(token)
            this.props.store.addFlashMessage("You have been logged in.", "success")
            this.props.history.replace("/")
        })
    }
}