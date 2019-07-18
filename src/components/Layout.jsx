import React from "react"
import {BrowserRouter, Link} from "react-router-dom"
import Routes from "./Routes"
import { observer } from "mobx-react"

@observer
export class Layout extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Navbar store={this.props.store}/>
                <div className="container">
                    <section className="section main-section">
                        <Routes store={this.props.store}/>
                    </section>
                </div>
            </BrowserRouter>
        )
    }
}

@observer
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

    logoutClicked() {
        this.props.store.setLoginToken(null)
        this.props.store.addFlashMessage("You have been logged out.")
        this.props.store.setRedirectTo("/login")
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
                            this.props.store.loggedIn &&
                            <Link to="/movies" className="navbar-item">Movies</Link>
                        }
                        
                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                {
                                    this.props.store.loggedIn &&
                                    <button className="button is-light" onClick={this.logoutClicked.bind(this)}>Log out</button>  
                                }        
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}