/* Login page shown whenever a login is required */
import React from "react"

export default class Login extends React.Component {
    render() {
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
                        <a href="/">Forgot your password?</a>
                        <p className="control pushed-control">
                            <button className="button is-primary">Login</button>
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
}