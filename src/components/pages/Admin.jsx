import BasePage from "./BasePage"
import React from "react"
import { when } from "mobx"
import {observer} from "mobx-react"
import { Route, Switch } from "react-router-dom"

@observer
export default class Admin extends BasePage {
    constructor(props) {
        super(props)

        this.state.title = "Admin - Nateflix"
        this.state.loading = true
        this.state.adminVerified = false
    }

    componentDidMount() {
        super.componentDidMount()

        // check admin once the token has been verified, disable loading state
        when(() => this.props.store.tokenVerified, () => {
            if (!this.mounted) return

            if (!this.props.store.userHasAdmin) {
                this.props.store.addFlashMessage("You do not have permission to access that page.", "warning")
                this.props.history.replace("/")
                return
            }

            this.setState({ loading: false, adminVerified: true })
        })
    }

    componentDidUpdate() {
        super.componentDidUpdate()
    }

    pageRender() {
        return (
            <div>
                <h1 className="title">Admin</h1>
                <div className="level is-mobile">
                    <div className="level-left">
                        <div className="level-item">
                            <p>Admin Category: </p>
                        </div>
                        <div className="level-item">
                            <div className="select">
                                <select>
                                    <option>Activity Log</option>
                                    <option>Users</option>
                                    <option>Movies</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <hr/>

                <Switch>
                    <Route path={`${this.props.match.url}/log`} component={Test1} />
                    <Route path={`${this.props.match.url}/users`} component={Test2} />
                    <Route component={AdminDefault}/>
                </Switch>
                
            </div>  
        )
    }
}

class AdminDefault extends React.Component {
    constructor(props) {
        super(props)

        // default redirect
        this.props.history.replace("/admin/log")
        
    }

    render() {
        return []
    }
}

class Test1 extends React.Component {
    render() {
        return <p>Test1</p>
    }
}


class Test2 extends React.Component {
    render() {
        return <p>Test2</p>
    }
}