import React from "react";
import { NavLink } from "react-router-dom";
import {
    FiHome,
    FiHome as FiDashboard,
    FiUsers,
    FiUser,
    FiSettings,
    FiLogOut,
} from "react-icons/fi";

import "./sidebar.scss";

// Updated nav items to match /dashboard child routes
const navItems = [
    { name: "Home", path: "/dashboard", icon: <FiDashboard /> },
    { name: "Properties", path: "/dashboard/property", icon: <FiHome /> },
    { name: "Tenants", path: "/dashboard/tenant", icon: <FiUsers /> },
    { name: "Profile", path: "/dashboard/profile", icon: <FiUser /> },
];

const SideBar = ({ user, onLogout }) => {
    return (
        <aside className="sidebar">
            <div className="logo">
                <img src="/logo.svg" alt="App logo" />
                <span className="title">Landlord Dashboard</span>
            </div>

            {user && (
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
                                className={({ isActive }) => (isActive ? "active" : "")}
                                end={item.path === "/dashboard"}
                            >
                                <span className="icon">{item.icon}</span>
                                <span>{item.name}</span>
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
