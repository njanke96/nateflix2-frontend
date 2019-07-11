import React from "react"
import {Switch, Route} from "react-router-dom"

import NotFound from "./pages/NotFound"
import Login from "./pages/Login"
import PasswordRecover from "./pages/PasswordRecover"

export default class Routes extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={Login}/>
                <Route path="/forgot-password" component={PasswordRecover}/>
                <Route component={NotFound}/>
            </Switch>
        )
    }
}