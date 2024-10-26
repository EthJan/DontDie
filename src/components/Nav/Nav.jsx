import './Nav.css';
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Nav = () => {
    return (
        <div className = "nav">
            <Link to="/">
                <img src={logo} alt='Dont Die, Stay Safe logo'/>
            </Link>
            <span className="nav-container">
                <Link to="/report" className="nav-link"><p>Report</p></Link>
                <Link to="/safety" className="nav-link"><p>Safety</p></Link>
                <Link to="/volunteer" className="nav-link"><p>Volunteer</p></Link>
            </span>
        </div>   
    );
}

export default Nav;