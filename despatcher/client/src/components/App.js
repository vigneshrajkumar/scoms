import React, { useEffect } from "react"

import Nav from "./Nav"

function App() {

    useEffect(() =>{
        fetch("/ping")
        .then(res => res.json())
        .then(res => console.log(res))
    })

    return (
        <div>
            <Nav />
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 text-center">
                        <h1 className="mt-5">Communications Despatcher</h1>
                        <p className="lead">Complete with pre-defined file paths and responsive navigation!</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App