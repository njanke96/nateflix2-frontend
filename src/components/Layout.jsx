import React from "react"
import {BrowserRouter, Link} from "react-router-dom"
import Routes from "./Routes"

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
            <BrowserRouter>
                <Navbar loggedIn={this.state.loggedIn}/>
                <div className="container">
                    <section className="section main-section">
                        <Routes />
                    </section>
                </div>
            </BrowserRouter>
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
                    <div className="navbar-item is-size-4 nf-logo">nateflix</div>
                    
                    {/* hidden button for dropdown on mobile*/}
                    {
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
                        <Link to="/" className="navbar-item">Home</Link>
                        {
                            this.props.loggedIn &&
                            <Link to="/movies" className="navbar-item">Movies</Link>
                        }
                        
                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                {
                                    this.props.loggedIn &&
                                    <button className="button is-light">Log out</button>  
                                }        
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}