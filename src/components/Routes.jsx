import React from "react"
import {Switch, Route} from "react-router-dom"
import { observer } from "mobx-react"

import NotFound from "./pages/NotFound"
import Login from "./pages/Login"
import PasswordRecover from "./pages/PasswordRecover"

@observer
export default class Routes extends React.Component {
    constructor(props) {
        super(props)
        this.pageComponent = this.pageComponent.bind(this)
    }

    render() {
        return (
            <Switch>
                <Route exact path="/" render={this.pageComponent(Login)}/>
                <Route path="/forgot-password" render={this.pageComponent(PasswordRecover)}/>
                <Route component={NotFound}/>
            </Switch>
        )
    }

    pageComponent(component) {
        // TODO: handle events from pages, define BasePage class
        return (routeProps) => React.createElement(component, {
            // all page components need access to the store
            store: this.props.store,
            ...routeProps
        }, null)
    }
}