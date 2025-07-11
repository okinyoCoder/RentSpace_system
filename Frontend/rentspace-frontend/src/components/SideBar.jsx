import React from "react";
import { NavLink } from "react-router-dom";
import {
    FiHome,
    FiUsers,
    FiUser,
    FiSettings,
    FiLogOut,
} from "react-icons/fi";

import "./sidebar.scss";

const navItems = [
    { name: "Home", path: "/landlord/", icon: <FiHome /> },
    { name: "Property", path: "/landlord/property", icon: <FiHome /> },
    { name: "Tenants", path: "/landlord/tenant", icon: <FiUsers /> },
    { name: "Profile", path: "/landlord/profile", icon: <FiUser /> },
];

const SideBar = ({ user, onLogout }) => {
    return (
        <aside className="sidebar">
            <div className="logo">
                <img src="/logo.svg" alt="App logo" />
                <span className="title">Landlord Dashboard</span>
            </div>

            {user?.avatar && (
                <div className="profile">
                    <img src={user.avatar} alt={`${user.name}'s avatar`} />
                    <div className="info">
                        <p className="name">{user.name}</p>
                        <p className="email">{user.email}</p>
                    </div>
                </div>
            )}

            <nav className="nav">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                }
                                end
                            >
                                <span className="icon">{item.icon}</span>
                                <span className="label">{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <button className="logout" onClick={onLogout}>
                <FiLogOut className="icon" />
                <span>Logout</span>
            </button>
        </aside>
    );
};

export default SideBar;
