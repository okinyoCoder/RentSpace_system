import { useState } from "react";
import "./navbar.scss"

function Navbar(){
    const [open, setOpen] = useState(false)
    const user = false;
    return (
        <nav>
            <div className="left">
                <a href="" className="logo">
                    <img src="" alt="" />
                    <span>Rentspace Finder</span>
                </a>
                <a href="">home</a>
                <a href="">about</a>
                <a href="">listing</a>
            </div>
            <div className="right">
                {user ?(
                     <div className="user">
                        <img src="" alt="" />
                        <span>user.name</span>
                        <Link to="/profile" className="profile">
                            <div className="notification"></div>
                            <span>Profile</span>
                        </Link>
                     </div>
                ) : (
                    <>
                        <a href="">sign in</a>
                        <a href="" className="register">sign up</a>
                    </>
                )}
                <div className="menuicon">
                   <img src="./src/assets/menu.png" alt="" onClick={()=> setOpen(!open)}/>
                </div>
                <div className={open ? "menu active" : "menu"}>
                    <a href="">home</a>
                    <a href="">about</a>
                    <a href="">listing</a>
                    <a href="">sign in</a>
                    <a href="">sign up</a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;