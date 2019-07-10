import React from "react"
import { hot } from "react-hot-loader"

import { Layout } from "./components/Layout"
import "./style/global.scss"

class App extends React.Component {
    render() {
        return (
            <div className="app" id="app">
                <Layout />
            </div>
        );
    }
}

export default hot(module)(App)