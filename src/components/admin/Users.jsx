import React from "react"
import BaseAdminPage from "./BaseAdminPage"
import OptionModal from "../OptionModal"
import requests from "../../requests"
import {formatIntTime} from "../../util"

export default class Users extends BaseAdminPage {
    constructor(props) {
        super(props)
        this.state.users = []
        this.state.editUser = {
            active: false,
            user: ""
        }
        this.state.removeConfirm = {
            loading: false,
            active: false,
            user: ""
        }
    }

    componentDidMount() {
        super.componentDidMount()

        // get users
        this.reloadUserData()
    }

    reloadUserData() {
        this.setState({ loading: true })
        requests.getAllUsers(this.props.store).then(result => {
            if (!this.mounted) return
            this.setState({ loading: false, users: result })
        })
    }

    onUserEdit(username) {
        this.setState({editUser: {active: true, user: username}})
    }

    onEditSaved(success) {
        const user = this.state.editUser.user
        this.setState({ editUser: { active: false, user: "" } })
        if (success) {
            this.setStatusMessage(`${user} has been edited.`)
        } else {
            this.setStatusMessage(`${user} could not be edited.`, true)
        }
        this.reloadUserData()
    }

    onEditCancelled() {
        this.setState({ editUser: { active: false, user: "" } })
    }

    onUserRemove(username) {
        this.setState({removeConfirm: {active: true, user: username, loading: false}})
    }

    onRemoveConfirmed(chosenIndex) {
        switch (chosenIndex) {
            case 0:
                // yes
                this.setState({removeConfirm: {...this.state.removeConfirm, loading: true}})
                requests.deleteUser(this.props.store, this.state.removeConfirm.user).then(result => {
                    if (!this.mounted) return

                    const user = this.state.removeConfirm.user

                    if (result) {
                        this.setStatusMessage(`${user} has been deleted.`)
                    } else {
                        this.setStatusMessage(`${user} could not be deleted.`, true)
                    }

                    this.setState({ removeConfirm: { loading: false, active: false, user: "" } })
                    this.reloadUserData()
                })
                break;
        
            case 1:
                // no
                this.setState({ removeConfirm: { loading: false, active: false, user: "" } })
                break;
        }

    }

    pageRender() {
        return (
            <div>
                {
                    // modals
                    this.state.removeConfirm.active && 
                        <OptionModal 
                            body={`Are you sure you want to remove ${this.state.removeConfirm.user}?`} 
                            onOptionClicked={this.onRemoveConfirmed.bind(this)}
                            loading={this.state.removeConfirm.loading}/>
                }
                {
                    this.state.editUser.active &&
                        <UserEditModal
                            user={this.state.editUser.user}
                            onSave={this.onEditSaved.bind(this)}
                            onCancel={this.onEditCancelled.bind(this)}
                            store={this.props.store}
                        />
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
            <span className="action-buttons is-flex-mobile">
                <button className="button is-primary is-small" onClick={this.editClicked.bind(this)}>Edit</button>
                <button className="button is-warning is-small" onClick={this.removeClicked.bind(this)}>Remove</button>
            </span>
        )
    }
}

class UserEditModal extends React.Component {
    mounted = false

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            ready: false,
            username: "",
            initialUsername: "",
            newPassword: "",
            email: "",
            hasAdmin: false,
        }
    }

    componentDidMount() {
        this.mounted = true

        requests.getUser(this.props.store, this.props.user).then(result => {
            if (!this.mounted) return

            if (!result) {
                this.props.onConfirm(false)
                return
            }
            this.setState({ready: true})

            this.setState({
                username: result.username,
                initialUsername: result.username,
                email: result.email,
                hasAdmin: result.admin_perms
            })
        })
    }

    componentWillUnmount() {
        this.mounted = false
    }

    onConfirm() {
        this.setState({loading: true})

        let data = {
            username: this.state.username,
            email: this.state.email,
            admin_perms: this.state.hasAdmin
        }

        if (this.state.newPassword.length > 0) {
            data.password = this.state.newPassword
        }

        requests.postUser(this.props.store, this.state.initialUsername, data).then(result => {
            if (!this.mounted) return
            this.props.onSave(result)
        })
    }

    render () {
        let modalClass = "modal" + (this.state.ready ? " is-active" : "")
        let saveBtnClass = "button is-primary" + (this.state.loading ? " is-loading" : "")

        return (
            <div className={modalClass}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Editing {this.props.user}</p>
                    </header>
                    <section className="modal-card-body">
                        <div className="field">
                            <label className="label">Username</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    className="input" 
                                    value={this.state.username}
                                    onChange={ev => this.setState({username: ev.target.value})}/>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Change Password</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    className="input" 
                                    placeholder="Leave this blank to not change" 
                                    onChange={ev => this.setState({ newPassword: ev.target.value })}/>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">E-mail</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    className="input"
                                    value={this.state.email}
                                    onChange={ev => this.setState({ email: ev.target.value })}/>
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <label className="checkbox">
                                    <input type="checkbox" checked={this.state.hasAdmin} onChange={ev => this.setState({ hasAdmin: ev.target.checked })}/>
                                        Admin Permissions
                                </label>
                            </div>
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                        <button className={saveBtnClass} onClick={this.onConfirm.bind(this)}>Save</button>
                        <button className="button" onClick={this.props.onCancel}>Cancel</button>
                    </footer>
                </div>
            </div>
        )
    }
}