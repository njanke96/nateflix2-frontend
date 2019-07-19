import React from "react"
import BasePage from "./BasePage"
import { observer } from "mobx-react"

@observer
export default class PasswordReset extends BasePage {
    constructor(props) {
        super(props)
        this.state.title = "Reset Nateflix Password"
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
                                <input type="password" className="input" />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Confirm Password</label>
                            <div className="control">
                                <input type="password" className="input" />
                            </div>

                        </div>
                        <div className="field is-grouped is-grouped-left">
                            <p className="control">
                                <button className="button is-primary">Submit</button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}