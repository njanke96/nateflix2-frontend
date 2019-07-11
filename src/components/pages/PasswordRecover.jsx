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
            </div>
        )
    }
}