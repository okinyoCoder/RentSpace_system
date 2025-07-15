import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import "./landlordpage.scss";

function LandlordPage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || storedUser.role !== "landlord") {
            navigate("/login"); // redirect if not landlord
        } else {
            setUser(storedUser);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (!user) return null; // Don't render layout until user is verified

    return (
        <div className="landlordLayout">
            <SideBar user={user} onLogout={handleLogout} />
            <main className="mainContent">
                <Outlet />
            </main>
        </div>
    );
}

export default LandlordPage;
