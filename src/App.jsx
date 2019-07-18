import React from "react"
import { hot } from "react-hot-loader"
import { observer } from "mobx-react"

import AppStore from "./store"
import { Layout } from "./components/Layout"

// this shit
import "core-js/stable"
import "regenerator-runtime/runtime"

// import global style
import "./style/global.scss"

const store = new AppStore()

@observer
class App extends React.Component {
    render() {
        return (
            <div className="app" id="app">
                <Layout store={store} />
            </div>
        );
    }
}

export default hot(module)(App)