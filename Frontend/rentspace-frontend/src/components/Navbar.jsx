import { useState } from "react";
import {Link} from 'react-router-dom';
import "./navbar.scss"

function Navbar(){
    const [open, setOpen] = useState(false)
    const user = false;
    return (
        <nav className="navTop">
            <div className="left">
                <Link className="logo a">
                    <img src="" alt="" />
                    <span>Rentspace Finder</span>
                </Link>
                <Link to="/" className="a">home</Link>
                <Link to="" className="a">about</Link>
                <Link to="/list" className="a">listing</Link>
            </div>
            <div className="right">
                {user ?(
                     <div className="user">
                        <img src="" alt="" />
                        <span>user.name</span>
                        <Link to="/profile" className="profile a">
                            <div className="notification"></div>
                            <span>Profile</span>
                        </Link>
                     </div>
                ) : (
                    <>
                        <Link to="/login" className="a">sign in</Link>
                        <Link to="/register" className="register a" >sign up</Link>
                    </>
                )}
                <div className="menuicon">
                   <img src="./src/assets/menu.png" alt="" onClick={()=> setOpen(!open)}/>
                </div>
                <div className={open ? "menu active" : "menu"}>
                    <Link className="a">home</Link>
                    <Link className="a">about</Link>
                    <Link className="a">listing</Link>
                    <Link to="/login" className="a">sign in</Link>
                    <Link to="/register"className="a">sign up</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;