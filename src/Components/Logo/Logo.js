import "./Logo.css"
import logo from '../../Images/buy-or-sell-stock-logo.png'

const Logo = () => {
    return (
        <div id='logo'>
            <img src={logo} />
        </div>
    )
}

export default Logo;