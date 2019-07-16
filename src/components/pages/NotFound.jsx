import React from "react"
import { observer } from "mobx-react"

@observer
export default class NotFound extends React.Component {
    render() {
        return (
            <div>
                <h1 className="title">Not Found</h1>
                <p>The page you are looking for does not exist.</p>
            </div>
        )
    }
}