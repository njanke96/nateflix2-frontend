import React from "react"
import {Switch, Route} from "react-router-dom"

import NotFound from "./pages/NotFound"
import Login from "./pages/Login"
import PasswordRecover from "./pages/PasswordRecover"

// anonymous functions for component rendering
function pageComponent(component) {
    // TODO: handle events from pages, define BasePage class
    return (routeProps) => React.createElement(component, {}, null)
}

export default class Routes extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={Login}/>
                <Route path="/forgot-password" render={pageComponent(PasswordRecover)}/>
                <Route component={NotFound}/>
            </Switch>
        )
    }
}