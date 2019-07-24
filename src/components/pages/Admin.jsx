import BasePage from "./BasePage"
import React from "react"
import { when } from "mobx"
import {observer} from "mobx-react"
import { Route, Switch, Redirect } from "react-router-dom"
import Users from "../admin/Users"

class ActivityLogPlaceholder extends React.Component {
    render() {
        return <p>Activity Log to be Implemented</p>
    }
}

const DEFAULT_ADMIN_PATH = "/admin/log"
const ADMIN_ROUTES = [
    {
        path: "/admin/log",

        // the value to be selected in the selector
        selectorValue: "log",

        // the text displayed in the selector
        selectorText: "Activity Log",

        // the component to render
        render: getRenderer(ActivityLogPlaceholder)
    },
    {
        path: "/admin/users",
        selectorValue: "users",
        selectorText: "Users",
        render: getRenderer(Users)
    }
]

/* Get a render function which passes the mobx store */
function getRenderer(component) {
    // javascript is so much fun /s
    return (store) => (props) => {
        return React.createElement(component, {
            store: store,
            ...props
        }, null)
    }
}

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

    getPageSelector(selectedValue) {
        return () => (
            <AdminPageSelector selectedValue={selectedValue} onValueChange={ev => {
                this.pageSelectorValueChange.bind(this)(ev.target.value)
            }}/>
        )
    }

    pageSelectorValueChange(newValue) {
        const matchedRoutes = ADMIN_ROUTES.filter(route => route.selectorValue === newValue)
        if (matchedRoutes.length !== 1) {
            console.error("Failed to match a route to the admin page selector value!");
            return
        }

        const newPath = matchedRoutes[0].path
        this.props.history.push(newPath)
    }

    pageRender() {
        return (
            <div>
                <div className="level is-mobile">
                    <div className="level-left">
                        <div className="level-item">
                            <p>Admin Category: </p>
                        </div>
                        <div className="level-item">
                            {ADMIN_ROUTES.map((route, index) => (
                                <Route
                                    key={index}
                                    path={route.path}
                                    render={this.getPageSelector(route.selectorValue)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <hr/>

                <Switch>
                    {ADMIN_ROUTES.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            render={route.render(this.props.store)}
                        />
                    ))}
                    <Route render={() => <Redirect to={DEFAULT_ADMIN_PATH} push={false}/>}/>
                </Switch>
                
            </div>  
        )
    }
}

class AdminPageSelector extends React.Component {
    render() {
        return (
            <div className="select">
                <select value={this.props.selectedValue} onChange={this.props.onValueChange}>
                    {ADMIN_ROUTES.map((route, index) => (
                        <option
                            key={index}
                            value={route.selectorValue}
                        >{route.selectorText}</option>
                    ))}
                </select>
            </div>
        )
    }
}


class Test2 extends React.Component {
    render() {
        return <p>Test2</p>
    }
}