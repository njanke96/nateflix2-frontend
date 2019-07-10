import React from "react"

export class Layout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // must be set when the user login status changes
            loggedIn: true
        }
    }

    render() {
        return (
            <div>
                <Navbar loggedIn={this.state.loggedIn}/>
                <div className="container">
                    <section className="section main-section">
                        This is the main section
                        <a href="/">This is a test link.</a>
                    </section>
                </div>
            </div>
        )
    }
}

class Navbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            burgerMenuActive: false
        }
    }

    toggleBurgerMenu () {
        return (e) => {
            this.setState((state) => {
                return { burgerMenuActive: !state.burgerMenuActive }
            })
        }
    }

    render() {
        let navMenuClass = "navbar-menu"
        let burgerButtonClass = "navbar-burger burger" 
        if (this.state.burgerMenuActive) {
            navMenuClass += " is-active"
            burgerButtonClass += " is-active"
        }

        return (
            <nav className="navbar is-info" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <div className="navbar-item is-size-4">nateflix</div>
                    
                    {/* hidden button for dropdown on mobile*/}
                    {
                        this.props.loggedIn && 
                        <a role="button" className={burgerButtonClass}
                        aria-label="menu" 
                        aria-expanded="false" 
                        data-target="topNavbar"
                        onClick={this.toggleBurgerMenu()}>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    }
                    
                </div>

                <div id="topNavbar" className={navMenuClass}>
                    <div className="navbar-start">
                        {
                            this.props.loggedIn && [
                                <a className="navbar-item" key="home">Home</a>,
                                <a className="navbar-item" key="movies">Movies</a>
                            ]
                        }
                        
                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                {
                                    this.props.loggedIn &&
                                    <a className="button is-light">Log out</a>  
                                }        
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}