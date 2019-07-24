import React from "react"
import BaseAdminPage from "./BaseAdminPage"
import OptionModal from "../OptionModal"
import requests from "../../requests"
import {formatIntTime} from "../../util"

export default class Users extends BaseAdminPage {
    constructor(props) {
        super(props)
        this.state.users = []
        this.state.removeConfirm = {
            active: false,
            user: ""
        }
    }

    componentDidMount() {
        super.componentDidMount()

        // get users
        this.setState({loading: true})
        requests.getAllUsers(this.props.store).then(result => {
            if (!this.mounted) return
            this.setState({loading: false, users: result})
        })
    }

    onUserEdit(username) {
        console.log(`${username} edited`)
    }

    onUserRemove(username) {
        this.setState({removeConfirm: {active: true, user: username}})
    }

    onRemoveConfirmed(chosenIndex) {
        switch (chosenIndex) {
            case 0:
                // yes
                console.log("Removing him.")
                break;
        
            case 1:
                // no
                console.log("Not removing him.")
                break;
        }

        this.setState({removeConfirm: {active: false, user: ""}})
    }

    pageRender() {
        return (
            <div>
                {
                    this.state.removeConfirm.active && 
                        <OptionModal 
                            body={`Are you sure you want to remove ${this.state.removeConfirm.user}?`} 
                            onOptionClicked={this.onRemoveConfirmed.bind(this)}/>
                }
                <div className="table-container">
                    <table className="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>E-mail</th>
                                <th>Admin</th>
                                <th>Last active</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.users.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.admin_perms ? "Yes" : "No"}</td>
                                        <td>{formatIntTime(user.last_active)}</td>
                                        <td>
                                            <UserActions 
                                                user={user.username}
                                                onEdited={this.onUserEdit.bind(this)}
                                                onRemoved={this.onUserRemove.bind(this)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

class UserActions extends React.Component {
    editClicked() {
        this.props.onEdited(this.props.user)
    }

    removeClicked() {
        this.props.onRemoved(this.props.user)
    }

    render() {
        return (
            <span className="action-buttons">
                <button className="button is-primary is-small" onClick={this.editClicked.bind(this)}>Edit</button>
                <button className="button is-warning is-small" onClick={this.removeClicked.bind(this)}>Remove</button>
            </span>
        )
    }
}