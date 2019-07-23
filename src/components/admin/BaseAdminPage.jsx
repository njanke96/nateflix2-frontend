import React from "react"

/* Similar to BasePage but for admin sub-pages */
export default class BaseAdminPage extends React.Component {
    mounted = false

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            statusMessage: "",
            statusMessageWarning: false
        }
    }

    componentDidMount() {
        this.mounted = true
    }

    componentWillUnmount() {
        this.mounted = false
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="is-centered">
                    <i className="fa fa-spin fa-2x fa-circle-o-notch" aria-hidden="true"></i>
                </div>
            )
        }

        let status = null
        if (this.state.statusMessage !== "") {
            let cls = "tag"
            if (this.state.statusMessageWarning) {
                cls += " is-warning"
            }
            status = (
                <div className="splitter">
                    <span className={cls}>
                        {this.state.statusMessage}
                    </span>
                </div>
            )
        }

        return (
            <div className="admin-page">
                {status}
                {this.pageRender()}
            </div>
        )
    }
}