import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "./navbar.scss";
import LogoutButton from "../auth/Logout";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navTop">
      <div className="left">
        <Link to="/" className="logo a">
          <img src="/assets/logo.png" alt="Rentspace Logo" />
          <span>Rentspace Finder</span>
        </Link>
        <Link to="/" className="a">home</Link>
        <Link to="/about" className="a">about</Link>
        <Link to="/list" className="a">listing</Link>
      </div>

      <div className="right">
        {user ? (
          <div className="user">
            <img
              src={user.avatar || "/assets/default-avatar.png"}
              alt="User Avatar"
            />
            <span>{user.username || "User"}</span>
            <LogoutButton isMobile={true} />
          </div>
        ) : (
          <>
            <Link to="/login" className="a">sign in</Link>
            <Link to="/register" className="register a">sign up</Link>
          </>
        )}

        <div className="menuicon">
          <img
            src="/assets/menu.png"
            alt="Menu"
            onClick={() => setOpen(!open)}
          />
        </div>

        <div className={open ? "menu active" : "menu"}>
          <Link to="/" className="a">home</Link>
          <Link to="/about" className="a">about</Link>
          <Link to="/list" className="a">listing</Link>
          {!user && (
            <>
              <Link to="/login" className="a">sign in</Link>
              <Link to="/register" className="a">sign up</Link>
            </>
          )}
          {user && (
            <>
              <Link to="/profile" className="a">profile</Link>
              <LogoutButton isMobile={true} />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
