import React from "react"
import { ReactComponent as ErrorImage } from "../../Images/13.svg"
import { Link } from "react-router-dom"

import "./ErrorComponent.css"


const ErrorComponent = () => {
    return (
        <div className="errorComponent-block">
                <div className="errorComponent-content">
                    <ErrorImage className="errorComponent-SVG"/>
                    <Link to="/" className="errorComponent-link">Take you home?</Link>
                </div>
        </div>
    )
}

export default ErrorComponent;