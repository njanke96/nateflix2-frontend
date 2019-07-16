/* Login page shown whenever a login is required */
import {Link} from "react-router-dom"
import React from "react"
import {observer} from "mobx-react"

import BasePage from "./BasePage"

@observer
export default class Login extends BasePage {
    pageRender() {
        return (
            <div className="login-page columns">

                <div className="column is-4">
                    <h1 className="title">Login</h1>
                    <div className="field">
                        <label className="label">Username</label>
                        <div className="control">
                            <input className="input" type="text" />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Password</label>
                        <div className="control">
                            <input className="input" type="password" />
                        </div>
                    </div>
                    <div className="field is-grouped">
                        <Link to="/forgot-password">Forgot your password?</Link>
                        <p className="control pushed-control">
                            <button className="button is-primary" onClick={this.loginClicked.bind(this)}>Login</button>
                        </p>
                    </div>
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
        // TODO: implement
    }
}