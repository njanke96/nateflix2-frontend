import React from "react"

export default class OptionModal extends React.Component {
    options = []
    title = ""

    constructor(props) {
        super(props)
        
        // pre-bind callback
        this.optionClicked = this.optionClicked.bind(this)
    }

    optionClicked(index) {
        return () => {
            this.props.onOptionClicked(index)
        }
    }

    renderOptions() {
        return this.options.map((option, index) => {
            if (typeof option === "object") {
                let colorClass = ""
                if (option.color) colorClass = ` is-${option.color}`

                return (
                    <button
                        key={index}
                        className={"button" + colorClass}
                        onClick={this.optionClicked(index)}>
                        {option.label}
                    </button>
                )
            } else if (typeof option === "string") {
                return (
                    <button
                        key={index}
                        className="button"
                        onClick={this.optionClicked(index)}>
                        {option}
                    </button>
                )
            }
        })
    }

    render() {
        // default prop values
        this.options = this.props.options || [
            { label: "Yes", color: "primary" },
            "No"
        ]

        this.title = this.props.title || "Confirm"

        // required props
        this.body = this.props.body

        return (
            <div className="modal is-active">
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{this.title}</p>
                    </header>
                    <section className="modal-card-body">
                        {
                            this.props.loading ? (
                                <div className="is-centered">
                                    <i className="fa fa-spin fa-2x fa-circle-o-notch" aria-hidden="true"></i>
                                </div>
                            ) : this.body
                        }
                    </section>
                    <footer className="modal-card-foot">
                        {
                            this.props.loading ? (
                                <p></p>
                            ) : this.renderOptions.bind(this)()
                        }
                    </footer>
                </div>
            </div>
        )
    }
}