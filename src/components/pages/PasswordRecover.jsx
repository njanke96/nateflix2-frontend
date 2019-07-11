import React from "react"

export default class PasswordRecover extends React.Component {
    render() {
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
                                <input type="text" className="input"/>
                            </div>
                        </div>
                        <div className="field is-grouped">
                            <p className="control pushed-control">
                                <button className="button is-primary">Submit</button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}