import SideBar from "../components/SideBar";
import "./landlordpage.scss";
import { Outlet } from "react-router-dom";

function LandlordPage() {
    return (
        <div className="landlordLayout">
            <SideBar />
            <main className="mainContent">
                <Outlet />
            </main>
        </div>
    );
}

export default LandlordPage;
