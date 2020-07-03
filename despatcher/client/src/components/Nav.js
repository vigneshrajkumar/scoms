import React from "react"


function Nav() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark static-top">
            <div className="container">
                <a className="navbar-brand" href="/">Despatcher</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="/contacts">Contacts</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/groups">Groups</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/history">History</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Nav