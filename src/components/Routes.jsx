import React from "react"
import {Switch, Route} from "react-router-dom"
import { observer } from "mobx-react"

import NotFound from "./pages/NotFound"
import Homepage from "./pages/Homepage"
import Login from "./pages/Login"
import PasswordRecover from "./pages/PasswordRecover"
import PasswordReset from "./pages/PasswordReset"

@observer
export default class Routes extends React.Component {
    constructor(props) {
        super(props)
        this.pageComponent = this.pageComponent.bind(this)
    }

    render() {
        return (
            <Switch>
                <Route exact path="/" render={this.pageComponent(Homepage)}/>
                <Route exact path="/login" render={this.pageComponent(Login)}/>
                <Route exact path="/forgot-password" render={this.pageComponent(PasswordRecover)}/>
                <Route exact path="/reset-password" render={this.pageComponent(PasswordReset)}/>
                <Route component={NotFound}/>
            </Switch>
        )
    }

    pageComponent(component) {
        return (routeProps) => React.createElement(component, {
            // all page components need access to the store
            store: this.props.store,
            ...routeProps
        }, null)
    }
}