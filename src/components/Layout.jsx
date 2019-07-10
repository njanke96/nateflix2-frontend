import React from "react"

export class Layout extends React.Component {
    render() {
        const serviceUrl = SERVICE_URL
        return (
            <div className="notification is-primary">
                <button className="delete"></button>
                The service url is {serviceUrl}
            </div>
        )
    }
}